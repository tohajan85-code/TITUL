import { useState } from 'react';

export default function GuiMockup() {
  const [fillCustomer, setFillCustomer] = useState(true);
  const [countPages, setCountPages] = useState(true);
  const [doMerge, setDoMerge] = useState(true);
  const [doSign, setDoSign] = useState(true);
  const [removeBreaks, setRemoveBreaks] = useState(true);
  const [signX, setSignX] = useState(385);
  const [signY, setSignY] = useState(45);
  const [signW, setSignW] = useState(210);
  const [logLines, setLogLines] = useState<string[]>([
    '[INFO] Программа запущена',
    '[INFO] Загрузка конфигурации из config.json',
    '[INFO] Шаблон: E:\\Титула\\template.docx',
    '[INFO] Папка исходников: E:\\Титула\\ИД',
    '[INFO] Зеркалирование структуры...',
    '[INFO] Структура готова.',
    '[INFO] [Раздел_1] title.pdf',
    '[INFO]   {{SECTION_NAME 1}} → "Водоснабжение": попаданий = 1',
    '[INFO]   {{SECTION_NAME 2}} → "Комплект чертежей": попаданий = 1',
    '[INFO]   {{SECTION_NAME 3}} → "АБВГ.000000-01": попаданий = 1',
    '[OK] Готово. Обработано: 36',
  ]);

  const runSimulation = () => {
    const newLines = [
      '[INFO] ▶ Запуск полного цикла...',
      '[INFO] Зеркалирование структуры...',
      '[INFO] Структура готова.',
      '[INFO] Открытие Word COM...',
      '[INFO] [Раздел_1] 01_Водоснабжение.pdf',
      '[INFO]   {{SECTION_NAME 1}} → "Внутреннее водоснабжение": попаданий = 1',
      '[INFO]   {{SECTION_NAME 2}} → "Комплект чертежей": попаданий = 1',
      '[INFO]   {{SECTION_NAME 3}} → "АБВГ.421100-01": попаданий = 1',
      '[INFO]   {{PAGES}} → "15": попаданий = 1',
      '[INFO] Сохранение: 3_Т_ФП_Р_01.docx, 3_Т_ФП_Р_01.pdf',
      '[INFO] Склейка: 01_Водоснабжение_ФП.pdf',
      doSign ? '[INFO] Подпись: 01_Водоснабжение_ФП_Подпись.pdf' : '[INFO] Подпись отключена',
      '[INFO] [Раздел_2] 02_Электроснабжение.pdf',
      '[INFO]   {{SECTION_NAME 1}} → "Электроснабжение": попаданий = 1',
      '[INFO]   {{PAGES}} → "23": попаданий = 1',
      '[INFO] Сохранение: 3_Т_ФП_Р_02.docx, 3_Т_ФП_Р_02.pdf',
      '[INFO] Склейка: 02_Электроснабжение_ФП.pdf',
      doSign ? '[INFO] Подпись: 02_Электроснабжение_ФП_Подпись.pdf' : '[INFO] Подпись отключена',
      '[OK] Готово. Обработано: 36 папок',
    ];
    setLogLines(newLines);
  };

  return (
    <section id="mockup" className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Интерфейс приложения</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Интерактивная демонстрация трёхколоночного GUI с настройками, предпросмотром подписи и журналом выполнения
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-4 bg-slate-700/50 rounded-full h-2 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full w-3/4 rounded-full animate-pulse"></div>
        </div>

        {/* Main mockup */}
        <div className="bg-slate-800 border border-slate-600 rounded-2xl overflow-hidden shadow-2xl">
          {/* Title bar */}
          <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-sm text-slate-400 ml-2">Титулы-ФП v1.0</span>
            </div>
            <span className="text-xs text-slate-500">Windows</span>
          </div>

          {/* Three columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-700">
            {/* Left column - Settings */}
            <div className="p-4 space-y-4">
              <h3 className="font-semibold text-blue-300 text-sm uppercase tracking-wider">Пути и настройки</h3>
              
              <div className="space-y-2">
                <div className="bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-xs text-slate-300 flex items-center justify-between">
                  <span className="truncate">E:\Титула\template.docx</span>
                  <span className="text-blue-400 text-[10px]">📁</span>
                </div>
                <div className="bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-xs text-slate-300 flex items-center justify-between">
                  <span className="truncate">E:\Титула\ИД</span>
                  <span className="text-blue-400 text-[10px]">📂</span>
                </div>
                <div className="bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-xs text-slate-300 flex items-center justify-between">
                  <span className="truncate">E:\Титула\Итог</span>
                  <span className="text-blue-400 text-[10px]">📂</span>
                </div>
                <div className="bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-xs text-slate-300 flex items-center justify-between">
                  <span className="truncate">E:\Титула\Подпись.png</span>
                  <span className="text-blue-400 text-[10px]">🖼️</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {[
                  { label: 'Заполнять рамку «Технический заказчик»', checked: fillCustomer, onChange: setFillCustomer },
                  { label: 'Подсчитывать страницы ({{PAGES}} = PDF + 1)', checked: countPages, onChange: setCountPages },
                  { label: 'Склеивать титул с исходником', checked: doMerge, onChange: setDoMerge },
                  { label: 'Вставлять подпись', checked: doSign, onChange: setDoSign },
                  { label: 'Удалять разрывы страниц', checked: removeBreaks, onChange: setRemoveBreaks },
                ].map((item) => (
                  <label key={item.label} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => item.onChange(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-slate-500 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Center column - Signature preview */}
            <div className="p-4 space-y-4">
              <h3 className="font-semibold text-purple-300 text-sm uppercase tracking-wider">Предпросмотр подписи</h3>
              
              {/* A4 preview */}
              <div className="bg-white rounded-lg aspect-[1/1.414] relative overflow-hidden shadow-inner">
                {/* Simulated title page content */}
                <div className="absolute inset-0 p-4 flex flex-col">
                  <div className="border-2 border-gray-300 rounded p-2 mb-2">
                    <div className="text-[8px] text-gray-500 text-center">РАБОЧАЯ ДОКУМЕНТАЦИЯ</div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center items-center">
                    <div className="text-[10px] text-gray-700 font-bold text-center mb-1">Внутреннее водоснабжение</div>
                    <div className="text-[8px] text-gray-500 text-center mb-2">Комплект чертежей</div>
                    <div className="text-[7px] text-gray-400 text-center">АБВГ.421100-01</div>
                  </div>
                  <div className="border border-gray-200 rounded p-1">
                    <div className="text-[6px] text-gray-400">Технический заказчик</div>
                    <div className="text-[6px] text-gray-400">Страниц: 15</div>
                  </div>
                </div>
                
                {/* Signature overlay rectangle */}
                {doSign && (
                  <div
                    className="absolute border-2 border-red-500/60 bg-red-500/10"
                    style={{
                      left: `${(signX / 595) * 100}%`,
                      bottom: `${(signY / 842) * 100}%`,
                      width: `${(signW / 595) * 100}%`,
                      height: `${((signW * 0.3) / 842) * 100}%`,
                    }}
                  >
                    <span className="absolute -top-4 left-0 text-[7px] text-red-500 font-mono">
                      подпись
                    </span>
                  </div>
                )}
              </div>

              {/* Coordinate controls */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1">
                  <label className="text-[10px] text-slate-400 w-6">X:</label>
                  <input
                    type="number"
                    value={signX}
                    onChange={(e) => setSignX(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-white"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <label className="text-[10px] text-slate-400 w-6">Y:</label>
                  <input
                    type="number"
                    value={signY}
                    onChange={(e) => setSignY(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-white"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <label className="text-[10px] text-slate-400 w-6">W:</label>
                  <input
                    type="number"
                    value={signW}
                    onChange={(e) => setSignW(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-white"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <label className="text-[10px] text-slate-400 w-6">H:</label>
                  <input
                    type="number"
                    value={Math.round(signW * 0.3)}
                    readOnly
                    className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-slate-500"
                  />
                </div>
              </div>

              {/* Arrow buttons */}
              <div className="flex justify-center gap-1">
                <button className="w-7 h-7 bg-slate-700 hover:bg-slate-600 rounded text-xs">←</button>
                <button className="w-7 h-7 bg-slate-700 hover:bg-slate-600 rounded text-xs">↑</button>
                <button className="w-7 h-7 bg-slate-700 hover:bg-slate-600 rounded text-xs">↓</button>
                <button className="w-7 h-7 bg-slate-700 hover:bg-slate-600 rounded text-xs">→</button>
              </div>
            </div>

            {/* Right column - Log */}
            <div className="p-4 flex flex-col">
              <h3 className="font-semibold text-green-300 text-sm uppercase tracking-wider mb-3">Журнал выполнения</h3>
              
              <div className="flex-1 bg-slate-900 border border-slate-600 rounded-lg p-3 overflow-y-auto max-h-80 font-mono text-[10px] leading-relaxed">
                {logLines.map((line, i) => (
                  <div
                    key={i}
                    className={`${
                      line.startsWith('[OK]') ? 'text-green-400' :
                      line.startsWith('[ERROR]') ? 'text-red-400' :
                      line.startsWith('[WARNING]') ? 'text-orange-400' :
                      'text-slate-300'
                    }`}
                  >
                    {line}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={runSimulation}
                  className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-xs font-medium transition-colors"
                >
                  ▶ Запустить
                </button>
                <button className="px-3 py-2 bg-red-600/50 hover:bg-red-500/50 rounded-lg text-xs font-medium transition-colors">
                  ■ Стоп
                </button>
                <button
                  onClick={() => setLogLines([])}
                  className="px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-xs font-medium transition-colors"
                >
                  Очистить
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
