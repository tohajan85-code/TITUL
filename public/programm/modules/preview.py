"""
Модуль предпросмотра подписи.

Рендерит первую страницу PDF и накладывает рамку положения подписи.
"""

import logging

try:
    import fitz  # PyMuPDF
    HAS_FITZ = True
except ImportError:
    HAS_FITZ = False
    logging.warning("PyMuPDF (fitz) не установлен. Предпросмотр PDF недоступен.")


def render_pdf_page(pdf_path: str, page_index: int = 0, dpi: float = 110):
    """
    Рендерит страницу PDF в QPixmap для отображения в GUI.
    
    Args:
        pdf_path: Путь к PDF-файлу.
        page_index: Индекс страницы (0-based).
        dpi: Разрешение рендеринга.
        
    Returns:
        QPixmap или None при ошибке.
    """
    if not HAS_FITZ:
        logging.error("PyMuPDF не установлен. Установите: pip install PyMuPDF")
        return None
    
    try:
        from PySide6.QtGui import QPixmap, QImage
        
        doc = fitz.open(pdf_path)
        if page_index >= len(doc):
            page_index = 0
        
        page = doc[page_index]
        
        # Матрица масштабирования
        zoom = dpi / 72.0
        mat = fitz.Matrix(zoom, zoom)
        
        # Рендеринг в pixmap
        pix = page.get_pixmap(matrix=mat)
        
        # Преобразование в QImage → QPixmap
        img = QImage(
            pix.samples,
            pix.width,
            pix.height,
            pix.stride,
            QImage.Format_RGB888
        )
        qpix = QPixmap.fromImage(img)
        
        doc.close()
        return qpix
        
    except Exception as e:
        logging.error(f"Ошибка рендеринга PDF {pdf_path}: {e}")
        return None


def draw_signature_preview(base_pixmap, sign_x: float, sign_y: float,
                           sign_w: float, sign_h: float, scale: float):
    """
    Рисует прямоугольник подписи поверх QPixmap.
    
    Args:
        base_pixmap: Базовый QPixmap (рендер страницы).
        sign_x: X-координата подписи (pt).
        sign_y: Y-координата подписи (pt, от низа страницы).
        sign_w: Ширина подписи (pt).
        sign_h: Высота подписи (pt).
        scale: Масштаб (пикселей на 1 pt).
        
    Returns:
        Новый QPixmap с нарисованным прямоугольником.
    """
    from PySide6.QtGui import QPainter, QColor, QPen
    
    pix = base_pixmap.copy()
    painter = QPainter(pix)
    painter.setPen(QPen(QColor(255, 0, 0, 200), 2))
    painter.setBrush(QColor(255, 0, 0, 40))
    
    # Перевод координат: PDF (Y от низа) → Qt (Y от верха)
    h_px = base_pixmap.height()
    x = sign_x * scale
    y = h_px - (sign_y + sign_h) * scale
    w = sign_w * scale
    h = sign_h * scale
    
    painter.drawRect(int(x), int(y), int(w), int(h))
    
    # Подпись координат
    painter.setPen(QColor(255, 0, 0, 255))
    from PySide6.QtGui import QFont
    font = QFont("Arial", 8)
    painter.setFont(font)
    painter.drawText(
        int(x) + 4,
        int(y) - 4,
        f"x={sign_x:.0f} y={sign_y:.0f} w={sign_w:.0f} h={sign_h:.1f}"
    )
    
    painter.end()
    return pix


def get_page_size(pdf_path: str, page_index: int = 0) -> tuple:
    """
    Возвращает размер страницы PDF в пунктах.
    
    Args:
        pdf_path: Путь к PDF-файлу.
        page_index: Индекс страницы.
        
    Returns:
        (width_pt, height_pt) или (595.0, 842.0) для A4 по умолчанию.
    """
    if not HAS_FITZ:
        return 595.0, 842.0  # A4
    
    try:
        doc = fitz.open(pdf_path)
        if page_index >= len(doc):
            page_index = 0
        page = doc[page_index]
        rect = page.rect
        doc.close()
        return rect.width, rect.height
    except Exception:
        return 595.0, 842.0
