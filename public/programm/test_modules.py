"""
Тестовый скрипт для проверки модулей без GUI.

Запуск: python test_modules.py
"""

import os
import sys
import logging

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)


def test_extract_pdf():
    """Тест извлечения данных из PDF."""
    print("\n=== Тест extract_pdf ===")
    
    # Проверка импорта
    try:
        from modules.extract_pdf import extract_pdf_info
        print("✓ Модуль импортирован")
    except ImportError as e:
        print(f"✗ Ошибка импорта: {e}")
        return False
    
    # Проверка функции с несуществующим файлом
    result = extract_pdf_info("nonexistent.pdf")
    print(f"✓ Обработка несуществующего файла: {result}")
    
    return True


def test_merge():
    """Тест модуля склейки."""
    print("\n=== Тест merge ===")
    
    try:
        from modules.merge import find_title_and_source
        print("✓ Модуль импортирован")
    except ImportError as e:
        print(f"✗ Ошибка импорта: {e}")
        return False
    
    # Проверка с несуществующей папкой
    result = find_title_and_source("nonexistent_folder")
    print(f"✓ Обработка несуществующей папки: {result}")
    
    return True


def test_signature():
    """Тест модуля подписи."""
    print("\n=== Тест signature ===")
    
    try:
        from modules.signature import DEFAULT_SIGNATURE_CONFIG
        print(f"✓ Конфигурация по умолчанию: {DEFAULT_SIGNATURE_CONFIG}")
    except ImportError as e:
        print(f"✗ Ошибка импорта: {e}")
        return False
    
    return True


def test_config():
    """Тест модуля конфигурации."""
    print("\n=== Тест config ===")
    
    try:
        from utils.config import get_default_config, get_config_path
        config = get_default_config()
        path = get_config_path()
        print(f"✓ Путь к конфигу: {path}")
        print(f"✓ Конфигурация по умолчанию: {list(config.keys())}")
    except ImportError as e:
        print(f"✗ Ошибка импорта: {e}")
        return False
    
    return True


def test_preview():
    """Тест модуля предпросмотра."""
    print("\n=== Тест preview ===")
    
    try:
        from modules.preview import get_page_size
        size = get_page_size("nonexistent.pdf")
        print(f"✓ Размер страницы по умолчанию: {size}")
    except ImportError as e:
        print(f"✗ Ошибка импорта: {e}")
        return False
    
    return True


def main():
    """Запуск всех тестов."""
    print("=" * 50)
    print("Тестирование модулей Титулы-ФП")
    print("=" * 50)
    
    results = []
    results.append(("extract_pdf", test_extract_pdf()))
    results.append(("merge", test_merge()))
    results.append(("signature", test_signature()))
    results.append(("config", test_config()))
    results.append(("preview", test_preview()))
    
    print("\n" + "=" * 50)
    print("Результаты:")
    print("=" * 50)
    
    all_passed = True
    for name, passed in results:
        status = "✓ ПРОЙДЕН" if passed else "✗ ПРОВАЛЕН"
        print(f"  {name}: {status}")
        if not passed:
            all_passed = False
    
    print("=" * 50)
    if all_passed:
        print("Все тесты пройдены!")
    else:
        print("Есть проваленные тесты!")
    
    return 0 if all_passed else 1


if __name__ == "__main__":
    sys.exit(main())
