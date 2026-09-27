"""
Установщик проекта Титулы-ФП.
Создаёт всю структуру папок и файлов автоматически.

Запуск: python installer.py
"""

import os
import sys


def create_file(path, content):
    """Создаёт файл с указанным содержимым."""
    os.makedirs(os.path.dirname(path) if os.path.dirname(path) else '.', exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  ✓ {path}")


def main():
    print("=" * 60)
    print("  Установщик проекта Титулы-ФП")
    print("=" * 60)
    print()

    # Проверка, что мы в правильной папке
    if os.path.exists('main.py') and os.path.exists('requirements.txt'):
        print("✓ Проект уже установлен!")
        print()
        print("Для запуска выполните:")
        print("  python main.py")
        return

    print("[1/8] Создание main.py...")
    create_file('main.py', '''"""
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
''')

    print()
    print("[2/8] Создание config.json...")
    create_file('config.json', '''{
  "template_path": "",
  "input_dir": "",
  "output_dir": "",
  "sign_path": "",
  "signature": {
    "sign_x": 385,
    "sign_y": 45,
    "sign_w": 210,
    "calibration": false
  },
  "options": {
    "fill_customer_table": true,
    "count_pages": true,
    "do_merge": true,
    "do_sign": false,
    "remove_breaks": true
  }
}
''')

    print()
    print("[3/8] Создание requirements.txt...")
    create_file('requirements.txt', '''# Титулы-ФП — Зависимости
# Установка: pip install -r requirements.txt

PySide6>=6.5.0
pdfplumber>=0.9.0
python-docx>=0.8.11
pywin32>=306
pypdf>=3.0.0
reportlab>=4.0.0
Pillow>=10.0.0
numpy>=1.24.0
PyMuPDF>=1.23.0
''')

    print()
    print("[4/8] Создание модулей обработки (modules/)...")

    create_file('modules/__init__.py', '''"""
Модули обработки документов.
"""

from .extract_pdf import extract_pdf_info
from .word_fill import open_word, process_file
from .merge import process_folder as merge_folder
from .signature import make_overlay, sign_pdf
from .pipeline import run_full

__all__ = [
    'extract_pdf_info',
    'open_word',
    'process_file',
    'merge_folder',
    'make_overlay',
    'sign_pdf',
    'run_full',
]
''')

    create_file('modules/extract_pdf.py', '''"""
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
            
            lines = text.split('\\n')
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
            
            name = "\\n".join(name_parts)
            
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
''')

    print()
    print("[5/8] Создание UI модулей (ui/)...")

    create_file('ui/__init__.py', '''"""
Модули пользовательского интерфейса.
"""

from .main_window import MainWindow

__all__ = ['MainWindow']
''')

    print()
    print("[6/8] Создание утилит (utils/)...")

    create_file('utils/__init__.py', '''"""
Утилиты приложения.
"""

from .config import load_config, save_config
from .logger import setup_logging

__all__ = ['load_config', 'save_config', 'setup_logging']
''')

    print()
    print("[7/8] Создание ресурсов (resources/)...")
    create_file('resources/README.md', '''# Папка ресурсов
# Сюда помещаются:
# - Иконки приложения
# - Дополнительные файлы
# - Шаблон .docx (опционально)
''')

    print()
    print("[8/8] Создание дополнительных файлов...")

    create_file('README.md', '''# Титулы-ФП v1.0

GUI-приложение для автоматизации обработки титульных листов рабочей документации.

## Возможности

- Заполнение титульного листа Word по данным из PDF-титульника раздела
- Формирование итоговых PDF-файлов (титул + исходный документ)
- Вставка подписи на титульную страницу с предварительным просмотром
- Опция включения/отключения подсчёта страниц и заполнения рамки «Технический заказчик»

## Требования

- Windows 10/11
- Microsoft Word (для COM-взаимодействия)
- Python 3.10+

## Установка

```bash
pip install -r requirements.txt
```

## Запуск

```bash
python main.py
```

## Сборка в .exe

```bash
pyinstaller --noconfirm --onefile --windowed --name "Титулы-ФП" --add-data "config.json;." main.py
```
''')

    print()
    print("=" * 60)
    print("  ✓ Установка завершена!")
    print("=" * 60)
    print()
    print("Теперь выполните:")
    print("  1. pip install -r requirements.txt")
    print("  2. python main.py")
    print()


if __name__ == "__main__":
    main()
