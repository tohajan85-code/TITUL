"""
Модуль основного конвейера обработки.

Объединяет все этапы: копирование, извлечение, заполнение, склейку, подпись.
"""

import os
import shutil
import logging

from .extract_pdf import extract_pdf_info
from .word_fill import open_word, process_file
from .merge import process_folder as merge_folder
from .signature import make_overlay, sign_pdf


def mirror_tree(src: str, dst: str, overwrite: bool = False) -> int:
    """
    Копирует дерево папок из src в dst.
    
    Args:
        src: Исходная папка.
        dst: Целевая папка.
        overwrite: Перезаписывать существующие файлы.
        
    Returns:
        Число скопированных файлов.
    """
    copied = 0
    
    for root, dirs, files in os.walk(src):
        rel = os.path.relpath(root, src)
        target_dir = dst if rel == "." else os.path.join(dst, rel)
        os.makedirs(target_dir, exist_ok=True)
        
        for f in files:
            s = os.path.join(root, f)
            d = os.path.join(target_dir, f)
            
            if os.path.exists(d) and not overwrite:
                continue
            
            try:
                shutil.copy2(s, d)
                copied += 1
            except Exception as e:
                logging.error(f"Копирование {s} → {d}: {e}")
    
    return copied


def find_first_pdf(folder: str) -> str:
    """
    Находит первый PDF-файл в папке (по алфавиту).
    
    Args:
        folder: Путь к папке.
        
    Returns:
        Имя файла или None.
    """
    try:
        for f in sorted(os.listdir(folder)):
            full = os.path.join(folder, f)
            if os.path.isfile(full) and f.lower().endswith('.pdf'):
                # Пропускаем уже обработанные файлы
                no_ext = os.path.splitext(f)[0]
                if no_ext.endswith('_ФП') or no_ext.endswith('_Подпись'):
                    continue
                if no_ext.startswith('3_Т_ФП_Р_'):
                    continue
                return f
    except Exception:
        pass
    return None


def run_full(input_dir: str, output_dir: str, template_path: str,
             fill_customer_table: bool = True,
             count_pages: bool = True,
             do_merge: bool = True,
             do_sign: bool = False,
             remove_breaks: bool = True,
             sign_path: str = None,
             sign_config: dict = None,
             log_callback=None) -> bool:
    """
    Основной конвейер обработки.
    
    Args:
        input_dir: Папка с исходниками.
        output_dir: Папка для результата.
        template_path: Путь к шаблону .docx.
        fill_customer_table: Заполнять рамку «Технический заказчик».
        count_pages: Подсчитывать страницы.
        do_merge: Склеивать титул с исходником.
        do_sign: Вставлять подпись.
        remove_breaks: Удалять разрывы страниц.
        sign_path: Путь к PNG подписи.
        sign_config: Конфигурация подписи (координаты).
        log_callback: Функция для вывода логов в GUI.
        
    Returns:
        True при успешном завершении.
    """
    def log(msg):
        logging.info(msg)
        if log_callback:
            log_callback(msg)
    
    # Проверка входных данных
    if not os.path.exists(template_path):
        log(f"[ERROR] Шаблон не найден: {template_path}")
        return False
    
    if not os.path.exists(input_dir):
        log(f"[ERROR] Папка с исходниками не найдена: {input_dir}")
        return False
    
    # Создание выходной папки
    os.makedirs(output_dir, exist_ok=True)
    
    # Зеркалирование структуры
    log("[INFO] Зеркалирование структуры...")
    copied = mirror_tree(input_dir, output_dir)
    log(f"[INFO] Скопировано файлов: {copied}")
    log("[INFO] Структура готова.")
    
    # Инициализация Word COM
    try:
        import pythoncom
        pythoncom.CoInitialize()
    except ImportError:
        log("[ERROR] pywin32 не установлен")
        return False
    
    word = open_word()
    log("[INFO] Word COM инициализирован.")
    
    # Подготовка оверлея подписи
    overlay = None
    if do_sign and sign_path and os.path.exists(sign_path):
        try:
            overlay = make_overlay(sign_path, sign_config)
            log(f"[INFO] Подпись загружена: {sign_path}")
        except Exception as e:
            log(f"[ERROR] Ошибка загрузки подписи: {e}")
            do_sign = False
    
    # Обработка папок
    processed = 0
    errors = 0
    
    try:
        for root, dirs, files in os.walk(input_dir):
            pdf_name = find_first_pdf(root)
            if not pdf_name:
                continue
            
            rel_path = os.path.relpath(root, input_dir)
            out_folder = output_dir if rel_path == "." else os.path.join(output_dir, rel_path)
            os.makedirs(out_folder, exist_ok=True)
            
            pdf_path = os.path.join(root, pdf_name)
            log(f"[INFO] [{rel_path}] {pdf_name}")
            
            # Заполнение шаблона
            ok, word = process_file(
                word, template_path, pdf_path, out_folder,
                fill_customer_table=fill_customer_table,
                count_pages=count_pages,
                remove_breaks_flag=remove_breaks
            )
            
            if not ok:
                errors += 1
                continue
            
            processed += 1
            
            # Склейка
            if do_merge:
                merge_ok = merge_folder(out_folder)
                if not merge_ok:
                    log(f"[WARNING] Склейка не выполнена для: {rel_path}")
            
            # Вставка подписи
            if do_sign and overlay is not None:
                for f in os.listdir(out_folder):
                    if f.endswith("_ФП.pdf"):
                        src = os.path.join(out_folder, f)
                        dst = os.path.join(
                            out_folder,
                            os.path.splitext(f)[0] + "_Подпись.pdf"
                        )
                        try:
                            sign_pdf(src, dst, overlay)
                        except Exception as e:
                            log(f"[ERROR] Подпись {f}: {e}")
                            errors += 1
    
    finally:
        # Закрытие Word
        try:
            word.Quit()
        except Exception:
            pass
        
        try:
            import pythoncom
            pythoncom.CoUninitialize()
        except Exception:
            pass
    
    log(f"[OK] Готово. Обработано: {processed}, ошибок: {errors}")
    return errors == 0
