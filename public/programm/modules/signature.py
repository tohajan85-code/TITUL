"""
Модуль вставки подписи в PDF.

Создаёт оверлей с подписью (или калибровочной рамкой) и накладывает на первую страницу.
"""

import os
import logging
from io import BytesIO

import numpy as np
from PIL import Image
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader


# Настройки по умолчанию
DEFAULT_SIGNATURE_CONFIG = {
    "sign_x": 385,
    "sign_y": 45,
    "sign_w": 210,
    "calibration": False,
}


def prepare_signature(path: str) -> tuple:
    """
    Подготавливает картинку подписи: убирает белый фон, обрезает поля.
    
    Args:
        path: Путь к PNG-файлу подписи.
        
    Returns:
        (BytesIO, width_px, height_px) — буфер с PNG и размеры.
    """
    img = Image.open(path).convert("RGBA")
    arr = np.array(img)
    
    # Определение белых пикселей
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    white = (r > 235) & (g > 235) & (b > 235)
    arr[white, 3] = 0  # Делаем белые пиксели прозрачными
    
    # Обрезка по альфа-каналу
    alpha = arr[:, :, 3]
    nonempty = np.argwhere(alpha > 10)
    
    if len(nonempty) > 0:
        y0, x0 = nonempty.min(axis=0)
        y1, x1 = nonempty.max(axis=0)
        arr = arr[y0:y1 + 1, x0:x1 + 1]
    
    # Сохранение в буфер
    out = Image.fromarray(arr)
    buf = BytesIO()
    out.save(buf, format="PNG")
    buf.seek(0)
    
    return buf, arr.shape[1], arr.shape[0]


def make_overlay(sign_path: str, config: dict):
    """
    Создаёт PDF-страницу с подписью или калибровочной рамкой.
    
    Args:
        sign_path: Путь к PNG-файлу подписи.
        config: Словарь с координатами:
            - sign_x: X-координата (pt)
            - sign_y: Y-координата (pt)
            - sign_w: Ширина (pt)
            - calibration: Режим калибровки (True/False)
            
    Returns:
        Объект Page из pypdf для наложения.
    """
    img_buf, w_px, h_px = prepare_signature(sign_path)
    
    # Вычисление высоты пропорционально ширине
    h_pt = config["sign_w"] * h_px / w_px
    
    # Создание PDF-страницы с оверлеем
    buf = BytesIO()
    c = canvas.Canvas(buf, pagesize=A4)
    
    if config.get("calibration", False):
        # Режим калибровки — красный прямоугольник
        c.setStrokeColorRGB(1, 0, 0)
        c.setLineWidth(1)
        c.rect(
            config["sign_x"],
            config["sign_y"],
            config["sign_w"],
            h_pt
        )
        c.setFillColorRGB(1, 0, 0)
        c.setFont("Helvetica", 8)
        c.drawString(
            config["sign_x"] + 2,
            config["sign_y"] + h_pt + 3,
            f"x={config['sign_x']} y={config['sign_y']} "
            f"w={config['sign_w']} h={h_pt:.1f}"
        )
    else:
        # Нормальный режим — вставка подписи
        c.drawImage(
            ImageReader(img_buf),
            config["sign_x"],
            config["sign_y"],
            width=config["sign_w"],
            height=h_pt,
            mask='auto'
        )
    
    c.save()
    buf.seek(0)
    
    return PdfReader(buf).pages[0]


def sign_pdf(src_path: str, dst_path: str, overlay) -> bool:
    """
    Накладывает оверлей подписи на первую страницу PDF.
    
    Args:
        src_path: Путь к исходному PDF.
        dst_path: Путь для сохранения результата.
        overlay: Объект Page с подписью.
        
    Returns:
        True при успехе.
    """
    try:
        reader = PdfReader(src_path)
        writer = PdfWriter()
        
        for i, page in enumerate(reader.pages):
            if i == 0:
                page.merge_page(overlay)
            writer.add_page(page)
        
        with open(dst_path, "wb") as f:
            writer.write(f)
        
        logging.info(f"  Подпись вставлена: {dst_path}")
        return True
        
    except Exception as e:
        logging.error(f"Ошибка вставки подписи {src_path}: {e}")
        return False


def get_signature_height(sign_path: str, sign_w: float) -> float:
    """
    Вычисляет высоту подписи при заданной ширине (пропорционально).
    
    Args:
        sign_path: Путь к PNG-файлу подписи.
        sign_w: Желаемая ширина в pt.
        
    Returns:
        Высота в pt.
    """
    try:
        _, w_px, h_px = prepare_signature(sign_path)
        return sign_w * h_px / w_px
    except Exception:
        return sign_w * 0.3  # Примерная высота
