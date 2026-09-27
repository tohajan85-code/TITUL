"""
Титулы-ФП — Главный файл приложения.
GUI-приложение для автоматизации обработки титульных листов рабочей документации.

Запуск: python main.py
Требования: Python 3.10+, MS Word, PySide6
"""

import sys
import os

# Добавляем корень проекта в путь
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from PySide6.QtWidgets import QApplication
from PySide6.QtCore import Qt

from ui.main_window import MainWindow
from utils.config import load_config, save_config
from utils.logger import setup_logging


def main():
    """Точка входа приложения."""
    # Настройка логирования
    setup_logging()

    # Загрузка конфигурации
    config = load_config()

    # Создание Qt-приложения
    app = QApplication(sys.argv)
    app.setApplicationName("Титулы-ФП")
    app.setApplicationVersion("1.0")

    # Применение стиля
    app.setStyle("Fusion")

    # Создание и показ главного окна
    window = MainWindow(config)
    window.show()

    # Запуск цикла событий
    exit_code = app.exec()

    # Сохранение конфигурации при выходе
    save_config(window.get_config())

    sys.exit(exit_code)


if __name__ == "__main__":
    main()
