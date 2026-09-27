# PowerShell скрипт для установки проекта Титулы-ФП
# Запуск: Правый клик → "Выполнить с помощью PowerShell"
# Или: PowerShell -ExecutionPolicy Bypass -File install.ps1

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Установка проекта Титулы-ФП" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Переход в папку проекта
$projectPath = "E:\Титула\Программ\programm"
if (!(Test-Path $projectPath)) {
    New-Item -ItemType Directory -Path $projectPath -Force | Out-Null
}
Set-Location $projectPath

Write-Host "[1/5] Создание структуры папок..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "modules" -Force | Out-Null
New-Item -ItemType Directory -Path "ui" -Force | Out-Null
New-Item -ItemType Directory -Path "utils" -Force | Out-Null
New-Item -ItemType Directory -Path "resources" -Force | Out-Null

Write-Host "[2/5] Создание requirements.txt..." -ForegroundColor Yellow
@"
# Титулы-ФП — Зависимости
PySide6>=6.5.0
pdfplumber>=0.9.0
python-docx>=0.8.11
pywin32>=306
pypdf>=3.0.0
reportlab>=4.0.0
Pillow>=10.0.0
numpy>=1.24.0
PyMuPDF>=1.23.0
"@ | Out-File -FilePath "requirements.txt" -Encoding UTF8

Write-Host "[3/5] Создание config.json..." -ForegroundColor Yellow
@"
{
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
"@ | Out-File -FilePath "config.json" -Encoding UTF8

Write-Host "[4/5] Создание основных файлов..." -ForegroundColor Yellow

# main.py
@"
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from PySide6.QtWidgets import QApplication
from ui.main_window import MainWindow
from utils.config import load_config, save_config
from utils.logger import setup_logging


def main():
    setup_logging()
    config = load_config()
    app = QApplication(sys.argv)
    app.setApplicationName("Титулы-ФП")
    app.setApplicationVersion("1.0")
    app.setStyle("Fusion")
    window = MainWindow(config)
    window.show()
    exit_code = app.exec()
    save_config(window.get_config())
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
"@ | Out-File -FilePath "main.py" -Encoding UTF8

Write-Host "[5/5] Создание модулей..." -ForegroundColor Yellow

# modules/__init__.py
@"
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
"@ | Out-File -FilePath "modules\__init__.py" -Encoding UTF8

# ui/__init__.py
@"
from .main_window import MainWindow
__all__ = ['MainWindow']
"@ | Out-File -FilePath "ui\__init__.py" -Encoding UTF8

# utils/__init__.py
@"
from .config import load_config, save_config
from .logger import setup_logging
__all__ = ['load_config', 'save_config', 'setup_logging']
"@ | Out-File -FilePath "utils\__init__.py" -Encoding UTF8

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✓ Структура создана!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Теперь выполните:" -ForegroundColor Cyan
Write-Host "  cd E:\Титула\Программ\programm" -ForegroundColor White
Write-Host "  pip install -r requirements.txt" -ForegroundColor White
Write-Host "  python main.py" -ForegroundColor White
Write-Host ""
Write-Host "Нажмите любую клавишу для выхода..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
