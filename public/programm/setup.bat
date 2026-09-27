@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   Установка проекта Титулы-ФП
echo ========================================
echo.

REM Создание структуры папок
echo [1/5] Создание структуры папок...
if not exist "modules" mkdir modules
if not exist "ui" mkdir ui
if not exist "utils" mkdir utils
if not exist "resources" mkdir resources

echo [2/5] Создание файлов...

REM main.py
(
echo """
echo Титулы-ФП — Главный файл приложения.
echo """
echo.
echo import sys
echo import os
echo.
echo sys.path.insert^(0, os.path.dirname^(os.path.abspath^(__file__^)^)^)
echo.
echo from PySide6.QtWidgets import QApplication
echo from ui.main_window import MainWindow
echo from utils.config import load_config, save_config
echo from utils.logger import setup_logging
echo.
echo.
echo def main^(^):
echo     setup_logging^(^)
echo     config = load_config^(^)
echo     app = QApplication^(sys.argv^)
echo     app.setApplicationName^("Титулы-ФП"^)
echo     app.setApplicationVersion^("1.0"^)
echo     app.setStyle^("Fusion"^)
echo     window = MainWindow^(config^)
echo     window.show^(^)
echo     exit_code = app.exec^(^)
echo     save_config^(window.get_config^(^)^)
echo     sys.exit^(exit_code^)
echo.
echo.
echo if __name__ == "__main__":
echo     main^(^)
) > main.py

REM config.json
(
echo {
echo   "template_path": "",
echo   "input_dir": "",
echo   "output_dir": "",
echo   "sign_path": "",
echo   "signature": {
echo     "sign_x": 385,
echo     "sign_y": 45,
echo     "sign_w": 210,
echo     "calibration": false
echo   },
echo   "options": {
echo     "fill_customer_table": true,
echo     "count_pages": true,
echo     "do_merge": true,
echo     "do_sign": false,
echo     "remove_breaks": true
echo   }
echo }
) > config.json

REM requirements.txt
(
echo PySide6^>=6.5.0
echo pdfplumber^>=0.9.0
echo python-docx^>=0.8.11
echo pywin32^>=306
echo pypdf^>=3.0.0
echo reportlab^>=4.0.0
echo Pillow^>=10.0.0
echo numpy^>=1.24.0
echo PyMuPDF^>=1.23.0
) > requirements.txt

echo [3/5] Создание модулей обработки...

REM modules/__init__.py
(
echo from .extract_pdf import extract_pdf_info
echo from .word_fill import open_word, process_file
echo from .merge import process_folder as merge_folder
echo from .signature import make_overlay, sign_pdf
echo from .pipeline import run_full
echo.
echo __all__ = [
echo     'extract_pdf_info',
echo     'open_word',
echo     'process_file',
echo     'merge_folder',
echo     'make_overlay',
echo     'sign_pdf',
echo     'run_full',
echo ]
) > modules\__init__.py

echo [4/5] Создание UI модулей...

REM ui/__init__.py
(
echo from .main_window import MainWindow
echo __all__ = ['MainWindow']
) > ui\__init__.py

REM utils/__init__.py
(
echo from .config import load_config, save_config
echo from .logger import setup_logging
echo __all__ = ['load_config', 'save_config', 'setup_logging']
) > utils\__init__.py

echo [5/5] Установка завершена!
echo.
echo Теперь выполните:
echo   pip install -r requirements.txt
echo   python main.py
echo.
pause
