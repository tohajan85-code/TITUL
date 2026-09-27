"""
Модуль работы с конфигурацией.

Читает и сохраняет config.json.
"""

import os
import json
import logging


# Путь к файлу конфигурации (рядом с программой)
CONFIG_FILENAME = "config.json"


def get_config_path() -> str:
    """
    Возвращает полный путь к config.json.
    
    Файл находится рядом с исполняемым файлом или скриптом.
    """
    # Для .exe (PyInstaller)
    if getattr(os.sys, 'frozen', False):
        base_dir = os.path.dirname(os.sys.executable)
    else:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    return os.path.join(base_dir, CONFIG_FILENAME)


def get_default_config() -> dict:
    """
    Возвращает конфигурацию по умолчанию.
    """
    return {
        "template_path": "",
        "input_dir": "",
        "output_dir": "",
        "sign_path": "",
        "signature": {
            "sign_x": 385,
            "sign_y": 45,
            "sign_w": 210,
            "calibration": False,
        },
        "options": {
            "fill_customer_table": True,
            "count_pages": True,
            "do_merge": True,
            "do_sign": False,
            "remove_breaks": True,
        },
    }


def load_config() -> dict:
    """
    Загружает конфигурацию из config.json.
    
    Если файл не найден — создаёт с настройками по умолчанию.
    
    Returns:
        Словарь конфигурации.
    """
    config_path = get_config_path()
    
    if os.path.exists(config_path):
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                config = json.load(f)
            
            # Дополнение отсутствующих ключей значениями по умолчанию
            default = get_default_config()
            for key, value in default.items():
                if key not in config:
                    config[key] = value
            
            # Для вложенных словарей
            if "signature" in config:
                for key, value in default["signature"].items():
                    if key not in config["signature"]:
                        config["signature"][key] = value
            
            if "options" in config:
                for key, value in default["options"].items():
                    if key not in config["options"]:
                        config["options"][key] = value
            
            logging.info(f"Конфигурация загружена: {config_path}")
            return config
            
        except Exception as e:
            logging.warning(f"Ошибка чтения конфигурации: {e}. Используются настройки по умолчанию.")
    
    # Создание файла по умолчанию
    config = get_default_config()
    save_config(config)
    logging.info(f"Создан файл конфигурации: {config_path}")
    
    return config


def save_config(config: dict) -> bool:
    """
    Сохраняет конфигурацию в config.json.
    
    Args:
        config: Словарь конфигурации.
        
    Returns:
        True при успехе.
    """
    config_path = get_config_path()
    
    try:
        with open(config_path, 'w', encoding='utf-8') as f:
            json.dump(config, f, indent=2, ensure_ascii=False)
        logging.info(f"Конфигурация сохранена: {config_path}")
        return True
    except Exception as e:
        logging.error(f"Ошибка сохранения конфигурации: {e}")
        return False


def load_signature_config() -> dict:
    """
    Загружает конфигурацию подписи из signature_config.json.
    
    Returns:
        Словарь с координатами подписи.
    """
    # Путь рядом с программой
    if getattr(os.sys, 'frozen', False):
        base_dir = os.path.dirname(os.sys.executable)
    else:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    sig_path = os.path.join(base_dir, "signature_config.json")
    
    default = {
        "sign_x": 385,
        "sign_y": 45,
        "sign_w": 210,
        "calibration": False,
    }
    
    if os.path.exists(sig_path):
        try:
            with open(sig_path, 'r', encoding='utf-8') as f:
                config = json.load(f)
            return config
        except Exception:
            pass
    
    return default
