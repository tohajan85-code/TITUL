import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Список всех файлов проекта с путями относительно корня programm/
const PROJECT_FILES = [
  'main.py',
  'config.json',
  'requirements.txt',
  'README.md',
  'build.bat',
  '.gitignore',
  'test_modules.py',
  'Титулы-ФП.spec',
  'modules/__init__.py',
  'modules/extract_pdf.py',
  'modules/word_fill.py',
  'modules/merge.py',
  'modules/signature.py',
  'modules/pipeline.py',
  'modules/preview.py',
  'ui/__init__.py',
  'ui/main_window.py',
  'ui/preview_widget.py',
  'ui/log_handler.py',
  'utils/__init__.py',
  'utils/config.py',
  'utils/logger.py',
  'resources/README.md',
];

export default function DownloadButton() {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownload = async () => {
    setDownloading(true);
    setProgress(0);

    try {
      const zip = new JSZip();
      const folder = zip.folder('programm');

      if (!folder) throw new Error('Не удалось создать папку в архиве');

      const total = PROJECT_FILES.length;

      // Загружаем все файлы параллельно
      const promises = PROJECT_FILES.map(async (filePath, index) => {
        try {
          const response = await fetch(`/programm/${filePath}`);
          if (!response.ok) {
            console.warn(`Не удалось загрузить: ${filePath}`);
            return;
          }
          const content = await response.text();
          folder.file(filePath, content);
        } catch (err) {
          console.warn(`Ошибка загрузки ${filePath}:`, err);
        }
        setProgress(Math.round(((index + 1) / total) * 100));
      });

      await Promise.all(promises);

      // Генерируем ZIP
      setProgress(95);
      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 },
      });

      // Сохраняем
      saveAs(blob, 'Титулы-ФП.zip');
      setProgress(100);

      // Сброс через 2 секунды
      setTimeout(() => {
        setDownloading(false);
        setProgress(0);
      }, 2000);
    } catch (error) {
      console.error('Ошибка создания архива:', error);
      alert('Ошибка при создании архива. Попробуйте ещё раз.');
      setDownloading(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleDownload}
        disabled={downloading}
        className={`
          relative px-8 py-4 rounded-xl font-semibold text-lg
          transition-all shadow-lg
          ${downloading
            ? 'bg-slate-700 text-slate-400 cursor-wait'
            : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-green-600/30 hover:shadow-green-500/40 hover:scale-105'
          }
        `}
      >
        {downloading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Упаковка... {progress}%
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Скачать ZIP-архив
          </span>
        )}
      </button>
      <span className="text-xs text-slate-500">
        {downloading ? 'Создание архива...' : '23 файла • ~45 КБ • готово к распаковке'}
      </span>
    </div>
  );
}
