"""
Модуль извлечения данных из PDF-титульников.

Извлекает: название раздела, описание комплекта, шифр, число страниц.
"""

import logging
import pdfplumber


def extract_pdf_info(pdf_path: str) -> tuple:
    """
    Извлекает данные из PDF-титульника раздела.
    
    Args:
        pdf_path: Путь к PDF-файлу.
        
    Returns:
        (name, desc, code, total_pages) — название, описание, шифр, число страниц.
        Если данные не найдены — возвращает None для соответствующих полей.
    """
    try:
        with pdfplumber.open(pdf_path) as pdf:
            total_pages = len(pdf.pages)
            text = pdf.pages[0].extract_text()
            
            if not text:
                logging.warning(f"PDF не содержит текста: {pdf_path}")
                return None, None, None, total_pages
            
            lines = text.split('\n')
            start_idx, end_idx = -1, -1
            
            # Поиск блока "РАБОЧАЯ ДОКУМЕНТАЦИЯ ... Генеральный директор"
            for i, line in enumerate(lines):
                if "РАБОЧАЯ ДОКУМЕНТАЦИЯ" in line:
                    start_idx = i
                if any(s in line for s in [
                    "Генеральный директор",
                    "г. Москва",
                    "Заказчик",
                    "Санкт-Петербург"
                ]):
                    if start_idx != -1 and end_idx == -1:
                        end_idx = i
                        break
            
            if start_idx == -1 or end_idx == -1:
                logging.warning(
                    f"Не найден блок данных в PDF: {pdf_path} "
                    f"(start={start_idx}, end={end_idx})"
                )
                return None, None, None, total_pages
            
            # Извлечение блока данных между маркерами
            block = [
                line.strip()
                for line in lines[start_idx + 1:end_idx]
                if line.strip()
            ]
            
            if not block:
                logging.warning(f"Пустой блок данных в PDF: {pdf_path}")
                return None, None, None, total_pages
            
            # Последняя строка — шифр
            code = block[-1]
            remaining = block[:-1]
            
            # Разделение на описание и название
            desc = ""
            name_parts = []
            
            for line in remaining:
                if any(k in line.lower() for k in [
                    "комплект", "чертеж", "документац"
                ]):
                    desc = line
                else:
                    name_parts.append(line)
            
            name = "\n".join(name_parts)
            
            logging.info(
                f"Извлечено из {pdf_path}: "
                f"name={name!r}, desc={desc!r}, code={code!r}, pages={total_pages}"
            )
            
            return name, desc, code, total_pages
            
    except Exception as e:
        logging.error(f"Ошибка чтения PDF {pdf_path}: {e}")
        return None, None, None, None


def extract_page_count(pdf_path: str) -> int:
    """
    Возвращает только число страниц в PDF.
    
    Args:
        pdf_path: Путь к PDF-файлу.
        
    Returns:
        Число страниц или None при ошибке.
    """
    try:
        with pdfplumber.open(pdf_path) as pdf:
            return len(pdf.pages)
    except Exception as e:
        logging.error(f"Ошибка подсчёта страниц {pdf_path}: {e}")
        return None
