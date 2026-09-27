"""
Виджет предпросмотра подписи.

Отображает первую страницу PDF с наложенной рамкой положения подписи.
Позволяет управлять координатами через спиннеры и кнопки.
"""

import os
import json
import logging

from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel,
    QSpinBox, QPushButton, QFileDialog, QGroupBox, QGridLayout
)
from PySide6.QtGui import QPixmap, QPainter, QColor, QPen, QFont
from PySide6.QtCore import Qt, Signal


class PreviewWidget(QWidget):
    """
    Виджет предпросмотра подписи с управлением координатами.
    """
    coordinates_changed = Signal(dict)  # Сигнал при изменении координат
    
    def __init__(self, parent=None):
        super().__init__(parent)
        
        self.pdf_path = None
        self.sign_config = {
            "sign_x": 385,
            "sign_y": 45,
            "sign_w": 210,
            "calibration": False,
        }
        self.base_pixmap = None
        self.page_width_pt = 595.0  # A4
        self.page_height_pt = 842.0
        self.scale = 1.0
        
        self._init_ui()
    
    def _init_ui(self):
        """Инициализация интерфейса."""
        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        
        # Заголовок
        title = QLabel("Предпросмотр подписи")
        title.setStyleSheet("font-weight: bold; color: #93c5fd; font-size: 12px;")
        layout.addWidget(title)
        
        # Область отображения
        self.preview_label = QLabel("Выберите PDF для предпросмотра")
        self.preview_label.setAlignment(Qt.AlignCenter)
        self.preview_label.setMinimumHeight(400)
        self.preview_label.setStyleSheet(
            "background-color: #1e293b; border: 1px solid #475569; "
            "border-radius: 8px; color: #94a3b8;"
        )
        layout.addWidget(self.preview_label)
        
        # Группа управления координатами
        coord_group = QGroupBox("Координаты подписи (pt)")
        coord_layout = QGridLayout(coord_group)
        
        # Спиннеры
        self.spin_x = QSpinBox()
        self.spin_x.setRange(0, 1000)
        self.spin_x.setValue(self.sign_config["sign_x"])
        self.spin_x.valueChanged.connect(self._on_coord_changed)
        
        self.spin_y = QSpinBox()
        self.spin_y.setRange(0, 1000)
        self.spin_y.setValue(self.sign_config["sign_y"])
        self.spin_y.valueChanged.connect(self._on_coord_changed)
        
        self.spin_w = QSpinBox()
        self.spin_w.setRange(10, 500)
        self.spin_w.setValue(self.sign_config["sign_w"])
        self.spin_w.valueChanged.connect(self._on_coord_changed)
        
        self.spin_h = QSpinBox()
        self.spin_h.setRange(10, 500)
        self.spin_h.setValue(63)  # Примерная высота
        self.spin_h.setReadOnly(True)
        
        coord_layout.addWidget(QLabel("X:"), 0, 0)
        coord_layout.addWidget(self.spin_x, 0, 1)
        coord_layout.addWidget(QLabel("Y:"), 0, 2)
        coord_layout.addWidget(self.spin_y, 0, 3)
        coord_layout.addWidget(QLabel("Ширина:"), 1, 0)
        coord_layout.addWidget(self.spin_w, 1, 1)
        coord_layout.addWidget(QLabel("Высота:"), 1, 2)
        coord_layout.addWidget(self.spin_h, 1, 3)
        
        layout.addWidget(coord_group)
        
        # Кнопки перемещения
        move_layout = QHBoxLayout()
        
        self.btn_left = QPushButton("←")
        self.btn_up = QPushButton("↑")
        self.btn_down = QPushButton("↓")
        self.btn_right = QPushButton("→")
        
        for btn in [self.btn_left, self.btn_up, self.btn_down, self.btn_right]:
            btn.setFixedSize(35, 30)
            move_layout.addWidget(btn)
        
        self.btn_left.clicked.connect(lambda: self._move(-5, 0))
        self.btn_right.clicked.connect(lambda: self._move(5, 0))
        self.btn_up.clicked.connect(lambda: self._move(0, 5))
        self.btn_down.clicked.connect(lambda: self._move(0, -5))
        
        move_layout.addStretch()
        layout.addLayout(move_layout)
        
        # Кнопки действий
        action_layout = QHBoxLayout()
        
        self.btn_save = QPushButton("Сохранить координаты")
        self.btn_save.clicked.connect(self._save_coordinates)
        
        self.btn_reset = QPushButton("Сбросить")
        self.btn_reset.clicked.connect(self._reset_coordinates)
        
        self.btn_load_pdf = QPushButton("Загрузить PDF")
        self.btn_load_pdf.clicked.connect(self._load_pdf)
        
        action_layout.addWidget(self.btn_load_pdf)
        action_layout.addWidget(self.btn_save)
        action_layout.addWidget(self.btn_reset)
        layout.addLayout(action_layout)
    
    def _on_coord_changed(self):
        """Обработчик изменения координат в спиннерах."""
        self.sign_config["sign_x"] = self.spin_x.value()
        self.sign_config["sign_y"] = self.spin_y.value()
        self.sign_config["sign_w"] = self.spin_w.value()
        
        # Обновление высоты
        if self.pdf_path:
            try:
                from modules.signature import get_signature_height
                h = get_signature_height(
                    self._get_sign_path(),
                    self.sign_config["sign_w"]
                )
                self.spin_h.setValue(int(h))
            except Exception:
                pass
        
        self._update_preview()
        self.coordinates_changed.emit(self.sign_config.copy())
    
    def _move(self, dx: int, dy: int):
        """Перемещает рамку подписи."""
        self.spin_x.setValue(self.spin_x.value() + dx)
        self.spin_y.setValue(self.spin_y.value() + dy)
    
    def _save_coordinates(self):
        """Сохраняет координаты в signature_config.json."""
        config_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "signature_config.json"
        )
        try:
            with open(config_path, 'w', encoding='utf-8') as f:
                json.dump(self.sign_config, f, indent=2, ensure_ascii=False)
            logging.info(f"Координаты сохранены: {config_path}")
        except Exception as e:
            logging.error(f"Ошибка сохранения координат: {e}")
    
    def _reset_coordinates(self):
        """Сбрасывает координаты к значениям по умолчанию."""
        self.sign_config = {
            "sign_x": 385,
            "sign_y": 45,
            "sign_w": 210,
            "calibration": False,
        }
        self.spin_x.setValue(385)
        self.spin_y.setValue(45)
        self.spin_w.setValue(210)
        self._update_preview()
    
    def _load_pdf(self):
        """Открывает диалог выбора PDF для предпросмотра."""
        path, _ = QFileDialog.getOpenFileName(
            self, "Выберите PDF", "", "PDF файлы (*.pdf)"
        )
        if path:
            self.set_pdf(path)
    
    def _get_sign_path(self) -> str:
        """Получает путь к файлу подписи из родительского окна."""
        try:
            main_window = self.window()
            if hasattr(main_window, 'get_sign_path'):
                return main_window.get_sign_path()
        except Exception:
            pass
        return ""
    
    def set_pdf(self, pdf_path: str):
        """
        Устанавливает PDF для предпросмотра.
        
        Args:
            pdf_path: Путь к PDF-файлу.
        """
        self.pdf_path = pdf_path
        
        # Рендеринг страницы
        try:
            from modules.preview import render_pdf_page, get_page_size
            
            self.base_pixmap = render_pdf_page(pdf_path, dpi=110)
            self.page_width_pt, self.page_height_pt = get_page_size(pdf_path)
            
            if self.base_pixmap:
                # Вычисление масштаба
                self.scale = self.base_pixmap.width() / self.page_width_pt
                self._update_preview()
            else:
                self.preview_label.setText("Не удалось отрендерить PDF")
        except Exception as e:
            logging.error(f"Ошибка предпросмотра: {e}")
            self.preview_label.setText(f"Ошибка: {e}")
    
    def _update_preview(self):
        """Обновляет отображение с рамкой подписи."""
        if not self.base_pixmap:
            return
        
        try:
            from modules.preview import draw_signature_preview
            
            sign_h = self.spin_h.value()
            result = draw_signature_preview(
                self.base_pixmap,
                self.sign_config["sign_x"],
                self.sign_config["sign_y"],
                self.sign_config["sign_w"],
                sign_h,
                self.scale
            )
            
            # Масштабирование под размер виджета
            scaled = result.scaled(
                self.preview_label.width() - 20,
                self.preview_label.height() - 20,
                Qt.KeepAspectRatio,
                Qt.SmoothTransformation
            )
            self.preview_label.setPixmap(scaled)
        except Exception as e:
            logging.error(f"Ошибка обновления предпросмотра: {e}")
    
    def set_config(self, config: dict):
        """
        Устанавливает конфигурацию подписи.
        
        Args:
            config: Словарь с координатами.
        """
        self.sign_config = config.copy()
        self.spin_x.setValue(config.get("sign_x", 385))
        self.spin_y.setValue(config.get("sign_y", 45))
        self.spin_w.setValue(config.get("sign_w", 210))
    
    def resizeEvent(self, event):
        """Обработка изменения размера виджета."""
        super().resizeEvent(event)
        self._update_preview()
