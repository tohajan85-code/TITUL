"""
Обработчик логов для вывода в GUI.

Обеспечивает цветовую маркировку строк лога.
"""

import logging
from PySide6.QtCore import Signal, QObject


class LogLevel:
    """Уровни логирования с цветами."""
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    OK = "ok"


class GUILogHandler(QObject):
    """
    Обработчик логов, отправляющий сообщения в GUI через сигнал.
    """
    log_message = Signal(str, str)  # (текст, уровень)
    
    def __init__(self):
        super().__init__()
    
    def emit(self, message: str, level: str = LogLevel.INFO):
        """Отправляет сообщение в GUI."""
        self.log_message.emit(message, level)


class QtLogHandler(logging.Handler):
    """
    Кастомный logging.Handler для перенаправления в GUI.
    """
    def __init__(self, gui_handler: GUILogHandler):
        super().__init__()
        self.gui_handler = gui_handler
    
    def emit(self, record):
        try:
            msg = self.format(record)
            
            # Определение уровня
            if record.levelno >= logging.ERROR:
                level = LogLevel.ERROR
            elif record.levelno >= logging.WARNING:
                level = LogLevel.WARNING
            elif "Готово" in msg or "[OK]" in msg:
                level = LogLevel.OK
            else:
                level = LogLevel.INFO
            
            self.gui_handler.emit(msg, level)
        except Exception:
            self.handleError(record)


def format_log_message(message: str, level: str) -> str:
    """
    Форматирует сообщение лога с префиксом уровня.
    
    Args:
        message: Текст сообщения.
        level: Уровень (info, warning, error, ok).
        
    Returns:
        Отформатированная строка.
    """
    prefixes = {
        LogLevel.INFO: "[INFO]",
        LogLevel.WARNING: "[WARNING]",
        LogLevel.ERROR: "[ERROR]",
        LogLevel.OK: "[OK]",
    }
    prefix = prefixes.get(level, "[INFO]")
    return f"{prefix} {message}"
