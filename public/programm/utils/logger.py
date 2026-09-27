"""
Модуль настройки логирования.

Настраивает файловый и консольный логгеры.
"""

import os
import sys
import logging
from logging.handlers import RotatingFileHandler


def get_log_dir() -> str:
    """
    Возвращает директорию для лог-файлов.
    """
    if getattr(sys, 'frozen', False):
        return os.path.dirname(sys.executable)
    else:
        return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def setup_logging(level: int = logging.INFO) -> None:
    """
    Настраивает систему логирования приложения.
    
    Создаёт:
    - application.log — основной лог (ротация 5 МБ)
    - Вывод в консоль (stdout)
    
    Args:
        level: Уровень логирования.
    """
    log_dir = get_log_dir()
    log_file = os.path.join(log_dir, "application.log")
    
    # Форматтер
    formatter = logging.Formatter(
        "%(asctime)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    
    # Корневой логгер
    root_logger = logging.getLogger()
    root_logger.setLevel(level)
    
    # Удаление старых обработчиков (при повторном вызове)
    root_logger.handlers.clear()
    
    # Файловый обработчик с ротацией
    try:
        file_handler = RotatingFileHandler(
            log_file,
            maxBytes=5 * 1024 * 1024,  # 5 МБ
            backupCount=3,
            encoding='utf-8'
        )
        file_handler.setFormatter(formatter)
        file_handler.setLevel(level)
        root_logger.addHandler(file_handler)
    except Exception as e:
        print(f"Не удалось создать файл лога: {e}")
    
    # Консольный обработчик
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    console_handler.setLevel(level)
    root_logger.addHandler(console_handler)
    
    logging.info(f"Логирование инициализировано. Файл: {log_file}")


def create_folder_log(output_dir: str) -> logging.Logger:
    """
    Создаёт отдельный логгер для папки результата.
    
    Записывает app.log в папку результата.
    
    Args:
        output_dir: Путь к папке результата.
        
    Returns:
        Настроенный логгер.
    """
    logger = logging.getLogger("folder_logger")
    logger.setLevel(logging.INFO)
    
    # Удаление старых обработчиков
    logger.handlers.clear()
    
    log_file = os.path.join(output_dir, "app.log")
    
    formatter = logging.Formatter(
        "%(asctime)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    
    try:
        file_handler = logging.FileHandler(log_file, encoding='utf-8')
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    except Exception as e:
        logging.warning(f"Не удалось создать лог папки: {e}")
    
    return logger
