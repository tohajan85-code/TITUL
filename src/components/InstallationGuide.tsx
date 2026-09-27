import { useState } from 'react';

interface Step {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
}

export default function InstallationGuide() {
  const [activeStep, setActiveStep] = useState('python');

  const steps: Step[] = [
    {
      id: 'python',
      title: '1. Скачать Python',
      icon: '🐍',
      content: (
        <div className="space-y-4">
          <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
            <h4 className="font-semibold text-blue-300 mb-2">Что нужно:</h4>
            <p className="text-sm text-slate-300">
              Python 3.10 или новее (рекомендуется 3.11 или 3.12)
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-white mb-2">Скачать Python:</h4>
              <a
                href="https://www.python.org/downloads/windows/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Python.org — Скачать для Windows
              </a>
            </div>

            <div className="bg-slate-900 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-300 mb-2">⚠️ ВАЖНО при установке:</h4>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Обязательно отметьте галочку <strong className="text-yellow-300">«Add Python to PATH»</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Выберите <strong>«Install Now»</strong></span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Проверка установки:</h4>
              <p className="text-sm text-slate-400 mb-2">Откройте командную строку (Win+R → cmd) и введите:</p>
              <code className="block bg-slate-900 rounded p-3 text-green-300 font-mono text-sm">
                python --version
              </code>
              <p className="text-xs text-slate-500 mt-2">
                Должно показать: <code className="text-green-400">Python 3.11.x</code> или новее
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'project',
      title: '2. Скачать проект',
      icon: '📦',
      content: (
        <div className="space-y-4">
          <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
            <h4 className="font-semibold text-green-300 mb-2">Что нужно:</h4>
            <p className="text-sm text-slate-300">
              ZIP-архив с файлами проекта «Титулы-ФП»
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-white mb-2">Скачать ZIP-архив:</h4>
              <a
                href="#download"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg text-white font-semibold transition-all shadow-lg shadow-green-600/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                ⬇ Скачать Титулы-ФП.zip
              </a>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Распаковать архив:</h4>
              <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                <li>Найдите скачанный файл <code className="text-blue-300">Титулы-ФП.zip</code></li>
                <li>Правый клик → <strong>«Извлечь всё...»</strong></li>
                <li>Укажите путь: <code className="text-blue-300">E:\Титула\Программ</code></li>
                <li>Нажмите <strong>«Извлечь»</strong></li>
              </ol>
            </div>

            <div className="bg-slate-900 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Результат:</h4>
              <p className="text-sm text-slate-400">
                Должна появиться папка <code className="text-green-300">E:\Титула\Программ\programm\</code> со всеми файлами
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'word',
      title: '3. Microsoft Word',
      icon: '📝',
      content: (
        <div className="space-y-4">
          <div className="bg-purple-900/20 border border-purple-600/30 rounded-lg p-4">
            <h4 className="font-semibold text-purple-300 mb-2">Что нужно:</h4>
            <p className="text-sm text-slate-300">
              Microsoft Word (любая версия 2016+) — обязателен для работы программы
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-300 mb-2">⚠️ Важно:</h4>
              <p className="text-sm text-slate-300">
                Программа использует COM-интерфейс Word через библиотеку <code className="text-yellow-300">pywin32</code>.
                <br/>
                Без установленного Word программа <strong>не сможет</strong> заполнять титульные листы.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Проверка:</h4>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Word установлен и запускается</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Можете открыть любой .docx файл</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Если Word не установлен:</h4>
              <p className="text-sm text-slate-400">
                Установите Microsoft Office или купите лицензию на{' '}
                <a
                  href="https://www.microsoft.com/ru-ru/microsoft-365/buy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  microsoft.com
                </a>
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'dependencies',
      title: '4. Установить зависимости',
      icon: '📚',
      content: (
        <div className="space-y-4">
          <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4">
            <h4 className="font-semibold text-amber-300 mb-2">Что нужно:</h4>
            <p className="text-sm text-slate-300">
              Python-библиотеки из файла requirements.txt
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Откройте командную строку:</h4>
              <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                <li>Нажмите <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Win+R</kbd></li>
                <li>Введите <code className="text-green-300">cmd</code> и нажмите Enter</li>
              </ol>
            </div>

            <div className="bg-slate-900 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Перейдите в папку проекта:</h4>
              <code className="block bg-slate-950 rounded p-3 text-green-300 font-mono text-sm">
                cd /d E:\Титула\Программ\programm
              </code>
            </div>

            <div className="bg-slate-900 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Установите зависимости:</h4>
              <code className="block bg-slate-950 rounded p-3 text-green-300 font-mono text-sm">
                pip install -r requirements.txt
              </code>
              <p className="text-xs text-slate-500 mt-2">
                Это установит: PySide6, pdfplumber, pypdf, reportlab, Pillow, numpy, PyMuPDF, pywin32
              </p>
            </div>

            <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
              <h4 className="font-semibold text-green-300 mb-2">✓ Проверка установки:</h4>
              <code className="block bg-slate-900 rounded p-3 text-green-300 font-mono text-sm">
                pip list
              </code>
              <p className="text-xs text-slate-400 mt-2">
                В списке должны быть все библиотеки из requirements.txt
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'template',
      title: '5. Подготовить шаблон Word',
      icon: '📄',
      content: (
        <div className="space-y-4">
          <div className="bg-cyan-900/20 border border-cyan-600/30 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-300 mb-2">Что нужно:</h4>
            <p className="text-sm text-slate-300">
              Файл шаблона титульного листа Word (.docx) с плейсхолдерами
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Плейсхолдеры в шаблоне:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <code className="px-2 py-1 bg-slate-900 rounded text-yellow-300 font-mono text-sm">
                    {'{{SECTION_NAME 1}}'}
                  </code>
                  <span className="text-sm text-slate-400">— Название раздела</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="px-2 py-1 bg-slate-900 rounded text-yellow-300 font-mono text-sm">
                    {'{{SECTION_NAME 2}}'}
                  </code>
                  <span className="text-sm text-slate-400">— Описание комплекта</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="px-2 py-1 bg-slate-900 rounded text-yellow-300 font-mono text-sm">
                    {'{{SECTION_NAME 3}}'}
                  </code>
                  <span className="text-sm text-slate-400">— Шифр документа</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="px-2 py-1 bg-slate-900 rounded text-yellow-300 font-mono text-sm">
                    {'{{PAGES}}'}
                  </code>
                  <span className="text-sm text-slate-400">— Число страниц</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Где разместить:</h4>
              <p className="text-sm text-slate-400">
                Сохраните шаблон в любом месте, например:
                <br/>
                <code className="text-blue-300">E:\Титула\template.docx</code>
              </p>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-300 mb-2">⚠️ Важно:</h4>
              <p className="text-sm text-slate-300">
                Плейсхолдеры должны быть вставлены как обычный текст (не как поля Word).
                <br/>
                Программа найдёт их и заменит на реальные данные из PDF.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'signature',
      title: '6. Подготовить подпись (опционально)',
      icon: '✍️',
      content: (
        <div className="space-y-4">
          <div className="bg-rose-900/20 border border-rose-600/30 rounded-lg p-4">
            <h4 className="font-semibold text-rose-300 mb-2">Что нужно (если используете подпись):</h4>
            <p className="text-sm text-slate-300">
              PNG-файл с изображением подписи (прозрачный фон рекомендуется)
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Требования к файлу:</h4>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Формат: <strong>PNG</strong> (с прозрачностью или белым фоном)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Рекомендуемое разрешение: 300+ DPI</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Программа автоматически удалит белый фон</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Где разместить:</h4>
              <p className="text-sm text-slate-400">
                Сохраните файл подписи, например:
                <br/>
                <code className="text-blue-300">E:\Титула\Подпись.png</code>
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Как получить PNG подписи:</h4>
              <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                <li>Подпишитесь на планшете/бумаге</li>
                <li>Отсканируйте или сфотографируйте</li>
                <li>Сохраните как PNG (можно обработать в Photoshop/GIMP)</li>
                <li>Или используйте готовую электронную подпись</li>
              </ol>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'launch',
      title: '7. Запустить программу',
      icon: '🚀',
      content: (
        <div className="space-y-4">
          <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
            <h4 className="font-semibold text-green-300 mb-2">Всё готово!</h4>
            <p className="text-sm text-slate-300">
              Запускаем приложение и начинаем работу
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-900 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Запуск из командной строки:</h4>
              <code className="block bg-slate-950 rounded p-3 text-green-300 font-mono text-sm">
                cd /d E:\Титула\Программ\programm<br/>
                python main.py
              </code>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Первый запуск:</h4>
              <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                <li>Откроется окно программы «Титулы-ФП»</li>
                <li>Укажите путь к шаблону .docx</li>
                <li>Укажите папку с исходниками (PDF-файлы разделов)</li>
                <li>Укажите папку для результата</li>
                <li>Настройте опции (чекбоксы)</li>
                <li>Нажмите <strong className="text-green-400">«▶ Запустить»</strong></li>
              </ol>
            </div>

            <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
              <h4 className="font-semibold text-green-300 mb-2">✓ Результат:</h4>
              <p className="text-sm text-slate-300">
                В папке результата появится структура с заполненными титульными листами:
              </p>
              <ul className="text-sm text-slate-400 space-y-1 mt-2">
                <li>• <code className="text-blue-300">3_Т_ФП_Р_XX.docx</code> — титульный лист Word</li>
                <li>• <code className="text-blue-300">3_Т_ФП_Р_XX.pdf</code> — титульный лист PDF</li>
                <li>• <code className="text-blue-300">*_ФП.pdf</code> — титул + исходник</li>
                <li>• <code className="text-blue-300">*_ФП_Подпись.pdf</code> — с подписью (если включено)</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'exe',
      title: '8. Собрать .exe (опционально)',
      icon: '📦',
      content: (
        <div className="space-y-4">
          <div className="bg-indigo-900/20 border border-indigo-600/30 rounded-lg p-4">
            <h4 className="font-semibold text-indigo-300 mb-2">Для чего:</h4>
            <p className="text-sm text-slate-300">
              Создать один .exe файл для запуска без Python
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-900 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Сборка через build.bat:</h4>
              <code className="block bg-slate-950 rounded p-3 text-green-300 font-mono text-sm">
                cd /d E:\Титула\Программ\programm<br/>
                build.bat
              </code>
            </div>

            <div className="bg-slate-900 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Или вручную:</h4>
              <code className="block bg-slate-950 rounded p-3 text-green-300 font-mono text-sm">
                pyinstaller Титулы-ФП.spec
              </code>
            </div>

            <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
              <h4 className="font-semibold text-green-300 mb-2">✓ Результат:</h4>
              <p className="text-sm text-slate-300">
                Файл <code className="text-green-400">dist\Титулы-ФП.exe</code> — готов к использованию!
              </p>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-300 mb-2">⚠️ Примечание:</h4>
              <p className="text-sm text-slate-300">
                Для работы .exe всё равно нужен установленный Microsoft Word.
                <br/>
                Размер файла: ~150-200 МБ (включает все зависимости).
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="guide" className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Пошаговая инструкция</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Подробное руководство по установке всех компонентов программы
          </p>
        </div>

        {/* Навигация по шагам */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                activeStep === step.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              <span className="mr-1">{step.icon}</span>
              <span className="hidden sm:inline">{step.title}</span>
              <span className="sm:hidden">{step.id}</span>
            </button>
          ))}
        </div>

        {/* Содержимое активного шага */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 md:p-8">
          {steps.find((s) => s.id === activeStep)?.content}
        </div>

        {/* Быстрые ссылки */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
            <h4 className="font-semibold text-blue-300 mb-3">🔗 Полезные ссылки</h4>
            <ul className="text-sm space-y-2">
              <li>
                <a
                  href="https://www.python.org/downloads/windows/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Скачать Python для Windows
                </a>
              </li>
              <li>
                <a
                  href="https://docs.python.org/3/using/windows.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Документация Python для Windows
                </a>
              </li>
              <li>
                <a
                  href="https://www.microsoft.com/ru-ru/microsoft-365/buy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Купить Microsoft Office
                </a>
              </li>
            </ul>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
            <h4 className="font-semibold text-green-300 mb-3">✅ Чек-лист готовности</h4>
            <ul className="text-sm text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>Python 3.10+ установлен</span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>Microsoft Word установлен</span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>Проект распакован</span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>Зависимости установлены (pip install)</span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>Шаблон .docx подготовлен</span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>Подпись PNG готова (опционально)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Решение проблем */}
        <div className="mt-8 bg-amber-900/20 border border-amber-600/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-amber-300 mb-4">⚠️ Решение частых проблем</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-white mb-1">«python» не является внутренней или внешней командой</h4>
              <p className="text-sm text-slate-400">
                → При установке Python не отметили галочку «Add Python to PATH». Переустановите Python с этой опцией.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Ошибка при pip install</h4>
              <p className="text-sm text-slate-400">
                → Обновите pip: <code className="text-green-300">python -m pip install --upgrade pip</code>
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Ошибка COM Word</h4>
              <p className="text-sm text-slate-400">
                → Убедитесь, что Word установлен и лицензирован. Закройте все открытые документы Word перед запуском программы.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
