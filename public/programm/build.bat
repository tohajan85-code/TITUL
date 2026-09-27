@echo off
REM ============================================
REM Сборка Титулы-ФП в .exe через PyInstaller
REM ============================================

echo [1/3] Проверка зависимостей...
pip install pyinstaller

echo [2/3] Сборка...
pyinstaller --noconfirm --onefile --windowed ^
    --name "Титулы-ФП" ^
    --add-data "config.json;." ^
    --icon "resources\app.ico" ^
    main.py

echo [3/3] Готово!
echo Файл: dist\Титулы-ФП.exe
pause
