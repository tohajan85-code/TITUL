"""
Главное окно приложения.

Трёхколоночный интерфейс: настройки | предпросмотр | журнал.
"""

import os
import logging
import threading

from PySide6.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QLabel, QPushButton, QFileDialog, QCheckBox,
    QTextEdit, QProgressBar, QGroupBox, QMessageBox,
    QSplitter, QFrame
)
from PySide6.QtCore import Qt, Signal, QThread, QObject
from PySide6.QtGui import QColor, QTextCharFormat

from .preview_widget import PreviewWidget
from .log_handler import GUILogHandler, QtLogHandler, LogLevel


class WorkerSignals(QObject):
    """Сигналы рабочего потока."""
    log = Signal(str, str)  # (сообщение, уровень)
    finished = Signal(bool)  # успех


class PipelineWorker(QThread):
    """Рабочий поток для запуска конвейера."""
    
    def __init__(self, config: dict):
        super().__init__()
        self.config = config
        self.signals = WorkerSignals()
        self._stop_flag = False
    
    def run(self):
        """Выполнение конвейера."""
        from modules.pipeline import run_full
        
        def log_callback(msg):
            if self._stop_flag:
                return
            # Определение уровня
            if "[ERROR]" in msg:
                level = LogLevel.ERROR
            elif "[WARNING]" in msg:
                level = LogLevel.WARNING
            elif "[OK]" in msg:
                level = LogLevel.OK
            else:
                level = LogLevel.INFO
            self.signals.log.emit(msg, level)
        
        try:
            result = run_full(
                input_dir=self.config["input_dir"],
                output_dir=self.config["output_dir"],
                template_path=self.config["template_path"],
                fill_customer_table=self.config["options"]["fill_customer_table"],
                count_pages=self.config["options"]["count_pages"],
                do_merge=self.config["options"]["do_merge"],
                do_sign=self.config["options"]["do_sign"],
                remove_breaks=self.config["options"].get("remove_breaks", True),
                sign_path=self.config.get("sign_path", ""),
                sign_config=self.config.get("signature", {}),
                log_callback=log_callback,
            )
            self.signals.finished.emit(result)
        except Exception as e:
            self.signals.log.emit(f"[ERROR] Критическая ошибка: {e}", LogLevel.ERROR)
            self.signals.finished.emit(False)
    
    def stop(self):
        """Остановка потока."""
        self._stop_flag = True


class MainWindow(QMainWindow):
    """Главное окно приложения «Титулы-ФП»."""
    
    def __init__(self, config: dict):
        super().__init__()
        self.config = config
        self.worker = None
        
        self._init_ui()
        self._load_config_to_ui()
        self._setup_logging()
    
    def _init_ui(self):
        """Инициализация интерфейса."""
        self.setWindowTitle("Титулы-ФП v1.0")
        self.setMinimumSize(1200, 700)
        self.resize(1400, 800)
        
        # Центральный виджет
        central = QWidget()
        self.setCentralWidget(central)
        main_layout = QVBoxLayout(central)
        main_layout.setContentsMargins(8, 8, 8, 8)
        
        # Прогресс-бар
        self.progress_bar = QProgressBar()
        self.progress_bar.setVisible(False)
        self.progress_bar.setStyleSheet("""
            QProgressBar {
                border: 1px solid #475569;
                border-radius: 4px;
                text-align: center;
                background-color: #1e293b;
                color: #e2e8f0;
            }
            QProgressBar::chunk {
                background-color: #3b82f6;
                border-radius: 3px;
            }
        """)
        main_layout.addWidget(self.progress_bar)
        
        # Три колонки
        splitter = QSplitter(Qt.Horizontal)
        
        # Левая колонка — настройки
        left_widget = self._create_left_panel()
        splitter.addWidget(left_widget)
        
        # Центральная колонка — предпросмотр
        center_widget = self._create_center_panel()
        splitter.addWidget(center_widget)
        
        # Правая колонка — журнал
        right_widget = self._create_right_panel()
        splitter.addWidget(right_widget)
        
        splitter.setSizes([300, 450, 350])
        main_layout.addWidget(splitter)
        
        # Нижняя панель с кнопками
        bottom_layout = QHBoxLayout()
        
        self.btn_run = QPushButton("▶ Запустить")
        self.btn_run.setStyleSheet("""
            QPushButton {
                background-color: #16a34a;
                color: white;
                font-weight: bold;
                padding: 8px 20px;
                border-radius: 6px;
                font-size: 14px;
            }
            QPushButton:hover { background-color: #22c55e; }
            QPushButton:disabled { background-color: #374151; color: #6b7280; }
        """)
        self.btn_run.clicked.connect(self._on_run)
        
        self.btn_stop = QPushButton("■ Стоп")
        self.btn_stop.setEnabled(False)
        self.btn_stop.setStyleSheet("""
            QPushButton {
                background-color: #dc2626;
                color: white;
                font-weight: bold;
                padding: 8px 20px;
                border-radius: 6px;
                font-size: 14px;
            }
            QPushButton:hover { background-color: #ef4444; }
            QPushButton:disabled { background-color: #374151; color: #6b7280; }
        """)
        self.btn_stop.clicked.connect(self._on_stop)
        
        self.btn_clear_log = QPushButton("Очистить лог")
        self.btn_clear_log.clicked.connect(self._clear_log)
        
        bottom_layout.addWidget(self.btn_run)
        bottom_layout.addWidget(self.btn_stop)
        bottom_layout.addStretch()
        bottom_layout.addWidget(self.btn_clear_log)
        
        main_layout.addLayout(bottom_layout)
    
    def _create_left_panel(self) -> QWidget:
        """Создание левой панели — пути и настройки."""
        widget = QWidget()
        layout = QVBoxLayout(widget)
        
        title = QLabel("Пути и настройки")
        title.setStyleSheet("font-weight: bold; color: #93c5fd; font-size: 12px;")
        layout.addWidget(title)
        
        # Пути
        paths_group = QGroupBox("Пути")
        paths_layout = QVBoxLayout(paths_group)
        
        self.btn_template = self._create_path_button(
            "Шаблон .docx", "template_path", "*.docx"
        )
        self.btn_input = self._create_path_button(
            "Папка исходников", "input_dir", None
        )
        self.btn_output = self._create_path_button(
            "Папка результата", "output_dir", None
        )
        self.btn_sign = self._create_path_button(
            "Картинка подписи .png", "sign_path", "*.png"
        )
        
        paths_layout.addWidget(self.btn_template)
        paths_layout.addWidget(self.btn_input)
        paths_layout.addWidget(self.btn_output)
        paths_layout.addWidget(self.btn_sign)
        layout.addWidget(paths_group)
        
        # Опции
        options_group = QGroupBox("Опции")
        options_layout = QVBoxLayout(options_group)
        
        self.chk_customer = QCheckBox("Заполнять рамку «Технический заказчик»")
        self.chk_pages = QCheckBox("Подсчитывать страницы ({{PAGES}} = PDF + 1)")
        self.chk_merge = QCheckBox("Склеивать титул с исходником")
        self.chk_sign = QCheckBox("Вставлять подпись")
        self.chk_breaks = QCheckBox("Удалять разрывы страниц")
        
        for chk in [self.chk_customer, self.chk_pages, self.chk_merge,
                     self.chk_sign, self.chk_breaks]:
            chk.setStyleSheet("color: #cbd5e1;")
            options_layout.addWidget(chk)
        
        layout.addWidget(options_group)
        layout.addStretch()
        
        return widget
    
    def _create_center_panel(self) -> QWidget:
        """Создание центральной панели — предпросмотр подписи."""
        widget = QWidget()
        layout = QVBoxLayout(widget)
        
        self.preview_widget = PreviewWidget()
        layout.addWidget(self.preview_widget)
        
        return widget
    
    def _create_right_panel(self) -> QWidget:
        """Создание правой панели — журнал."""
        widget = QWidget()
        layout = QVBoxLayout(widget)
        
        title = QLabel("Журнал выполнения")
        title.setStyleSheet("font-weight: bold; color: #86efac; font-size: 12px;")
        layout.addWidget(title)
        
        self.log_text = QTextEdit()
        self.log_text.setReadOnly(True)
        self.log_text.setStyleSheet("""
            QTextEdit {
                background-color: #0f172a;
                border: 1px solid #475569;
                border-radius: 6px;
                color: #e2e8f0;
                font-family: 'Consolas', 'Courier New', monospace;
                font-size: 11px;
                padding: 4px;
            }
        """)
        layout.addWidget(self.log_text)
        
        return widget
    
    def _create_path_button(self, label: str, config_key: str,
                            file_filter: str) -> QPushButton:
        """Создаёт кнопку выбора пути."""
        btn = QPushButton(f"📁 {label}: не выбрано")
        btn.setStyleSheet("""
            QPushButton {
                text-align: left;
                padding: 6px 10px;
                background-color: #1e293b;
                border: 1px solid #475569;
                border-radius: 6px;
                color: #94a3b8;
                font-size: 11px;
            }
            QPushButton:hover {
                border-color: #3b82f6;
                color: #e2e8f0;
            }
        """)
        
        def on_click():
            if file_filter and file_filter.startswith("*."):
                path, _ = QFileDialog.getOpenFileName(
                    self, f"Выберите {label}", "", f"Файлы ({file_filter})"
                )
            else:
                path = QFileDialog.getExistingDirectory(
                    self, f"Выберите {label}"
                )
            
            if path:
                self.config[config_key] = path
                btn.setText(f"📁 {label}: {os.path.basename(path)}")
                btn.setToolTip(path)
        
        btn.clicked.connect(on_click)
        btn.config_key = config_key
        btn.label = label
        return btn
    
    def _load_config_to_ui(self):
        """Загружает конфигурацию в элементы интерфейса."""
        # Пути
        for btn in [self.btn_template, self.btn_input,
                     self.btn_output, self.btn_sign]:
            key = btn.config_key
            path = self.config.get(key, "")
            if path:
                btn.setText(f"📁 {btn.label}: {os.path.basename(path)}")
                btn.setToolTip(path)
        
        # Опции
        opts = self.config.get("options", {})
        self.chk_customer.setChecked(opts.get("fill_customer_table", True))
        self.chk_pages.setChecked(opts.get("count_pages", True))
        self.chk_merge.setChecked(opts.get("do_merge", True))
        self.chk_sign.setChecked(opts.get("do_sign", False))
        self.chk_breaks.setChecked(opts.get("remove_breaks", True))
        
        # Предпросмотр
        sig_config = self.config.get("signature", {})
        self.preview_widget.set_config(sig_config)
    
    def _setup_logging(self):
        """Настройка логирования в GUI."""
        self.gui_handler = GUILogHandler()
        self.gui_handler.log_message.connect(self._append_log)
        
        qt_handler = QtLogHandler(self.gui_handler)
        qt_handler.setFormatter(logging.Formatter("%(message)s"))
        logging.getLogger().addHandler(qt_handler)
    
    def _append_log(self, message: str, level: str):
        """Добавляет строку в журнал с цветовой маркировкой."""
        colors = {
            LogLevel.INFO: "#e2e8f0",
            LogLevel.WARNING: "#f59e0b",
            LogLevel.ERROR: "#ef4444",
            LogLevel.OK: "#22c55e",
        }
        color = colors.get(level, "#e2e8f0")
        
        self.log_text.append(f'<span style="color: {color};">{message}</span>')
        
        # Прокрутка вниз
        scrollbar = self.log_text.verticalScrollBar()
        scrollbar.setValue(scrollbar.maximum())
    
    def _clear_log(self):
        """Очищает журнал."""
        self.log_text.clear()
    
    def _on_run(self):
        """Запуск конвейера."""
        # Валидация
        if not self.config.get("template_path"):
            QMessageBox.warning(self, "Ошибка", "Не указан шаблон .docx")
            return
        if not self.config.get("input_dir"):
            QMessageBox.warning(self, "Ошибка", "Не указана папка исходников")
            return
        if not self.config.get("output_dir"):
            QMessageBox.warning(self, "Ошибка", "Не указана папка результата")
            return
        
        if self.config["options"]["do_sign"] and not self.config.get("sign_path"):
            QMessageBox.warning(self, "Ошибка", "Включена вставка подписи, но не указан файл подписи")
            return
        
        # Обновление конфигурации из UI
        self._update_config_from_ui()
        
        # Запуск в потоке
        self.btn_run.setEnabled(False)
        self.btn_stop.setEnabled(True)
        self.progress_bar.setVisible(True)
        self.progress_bar.setRange(0, 0)  # Неопределённый прогресс
        
        self.worker = PipelineWorker(self.config)
        self.worker.signals.log.connect(self._append_log)
        self.worker.signals.finished.connect(self._on_finished)
        self.worker.start()
    
    def _on_stop(self):
        """Остановка конвейера."""
        if self.worker:
            self.worker.stop()
        self._append_log("[WARNING] Остановка запрошена пользователем", LogLevel.WARNING)
    
    def _on_finished(self, success: bool):
        """Обработка завершения конвейера."""
        self.btn_run.setEnabled(True)
        self.btn_stop.setEnabled(False)
        self.progress_bar.setVisible(False)
        
        if success:
            self._append_log("[OK] Обработка завершена успешно!", LogLevel.OK)
        else:
            self._append_log("[ERROR] Обработка завершена с ошибками", LogLevel.ERROR)
    
    def _update_config_from_ui(self):
        """Обновляет конфигурацию из элементов UI."""
        self.config["options"]["fill_customer_table"] = self.chk_customer.isChecked()
        self.config["options"]["count_pages"] = self.chk_pages.isChecked()
        self.config["options"]["do_merge"] = self.chk_merge.isChecked()
        self.config["options"]["do_sign"] = self.chk_sign.isChecked()
        self.config["options"]["remove_breaks"] = self.chk_breaks.isChecked()
        
        self.config["signature"] = self.preview_widget.sign_config.copy()
    
    def get_config(self) -> dict:
        """Возвращает текущую конфигурацию."""
        self._update_config_from_ui()
        return self.config
    
    def get_sign_path(self) -> str:
        """Возвращает путь к файлу подписи."""
        return self.config.get("sign_path", "")
