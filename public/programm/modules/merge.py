"""
Модуль склейки PDF-файлов.

Объединяет титульный лист и исходный документ раздела в единый PDF.
"""

import os
import logging
from pypdf import PdfWriter, PdfReader


def find_title_and_source(folder: str) -> tuple:
    """
    Находит титульный лист и исходник в папке.
    
    Титул — файл с именем, начинающимся на '3_Т_ФП_Р_'.
    Исходник — первый PDF, не являющийся титулом и не имеющий суффиксов _ФП/_Подпись.
    
    Args:
        folder: Путь к папке.
        
    Returns:
        (title_path, source_path) или (None, None) если не найдены.
    """
    try:
        files = sorted(os.listdir(folder))
    except Exception as e:
        logging.error(f"Ошибка чтения папки {folder}: {e}")
        return None, None
    
    title = None
    source = None
    
    for f in files:
        full = os.path.join(folder, f)
        if not (os.path.isfile(full) and f.lower().endswith('.pdf')):
            continue
        
        no_ext = os.path.splitext(f)[0]
        
        # Титульный лист
        if no_ext.startswith('3_Т_ФП_Р_'):
            if title is None:
                title = full
            continue
        
        # Пропуск уже склеенных файлов и файлов с подписью
        if no_ext.endswith('_ФП') or no_ext.endswith('_Подпись'):
            continue
        
        # Исходный документ
        if source is None:
            source = full
    
    return title, source


def merge_pdfs(title_path: str, source_path: str, output_path: str) -> bool:
    """
    Объединяет титул и исходник в один PDF.
    
    Args:
        title_path: Путь к PDF титульного листа.
        source_path: Путь к PDF исходного документа.
        output_path: Путь для сохранения результата.
        
    Returns:
        True при успехе.
    """
    try:
        writer = PdfWriter()
        
        # Добавляем страницы титула
        title_reader = PdfReader(title_path)
        for page in title_reader.pages:
            writer.add_page(page)
        
        # Добавляем страницы исходника
        source_reader = PdfReader(source_path)
        for page in source_reader.pages:
            writer.add_page(page)
        
        # Сохранение
        with open(output_path, "wb") as f:
            writer.write(f)
        
        logging.info(f"  Склейка: {output_path} "
                     f"({len(title_reader.pages)} + {len(source_reader.pages)} стр.)")
        return True
        
    except Exception as e:
        logging.error(f"Ошибка склейки {title_path} + {source_path}: {e}")
        return False


def process_folder(folder: str) -> bool:
    """
    Находит титул и исходник в папке и склеивает их.
    
    Args:
        folder: Путь к папке с PDF-файлами.
        
    Returns:
        True при успехе.
    """
    title, source = find_title_and_source(folder)
    
    if not title or not source:
        if not title:
            logging.warning(f"  Титул не найден в: {folder}")
        if not source:
            logging.warning(f"  Исходник не найден в: {folder}")
        return False
    
    # Формирование имени выходного файла
    src_name = os.path.basename(source)
    src_base = os.path.splitext(src_name)[0]
    out_path = os.path.join(folder, f"{src_base}_ФП.pdf")
    
    # Удаление старого файла
    if os.path.exists(out_path):
        try:
            os.remove(out_path)
        except Exception:
            pass
    
    return merge_pdfs(title, source, out_path)
