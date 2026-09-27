import { useState } from 'react';

export default function ConfigSection() {
  const [config, setConfig] = useState({
    template_path: "E:\\Титула\\template.docx",
    input_dir: "E:\\Титула\\ИД",
    output_dir: "E:\\Титула\\Итог",
    sign_path: "E:\\Титула\\Подпись.png",
    signature: {
      sign_x: 385,
      sign_y: 45,
      sign_w: 210,
      calibration: false,
    },
    options: {
      fill_customer_table: true,
      count_pages: true,
      do_merge: true,
      do_sign: true,
    },
  });

  const configJson = JSON.stringify(config, null, 2);

  return (
    <section id="config" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Конфигурация</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Файл config.json хранит все настройки программы и создаётся автоматически при первом запуске
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Config editor */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-300">Параметры</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Шаблон (.docx)</label>
                <input
                  type="text"
                  value={config.template_path}
                  onChange={(e) => setConfig({ ...config, template_path: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Папка исходников</label>
                <input
                  type="text"
                  value={config.input_dir}
                  onChange={(e) => setConfig({ ...config, input_dir: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Папка результата</label>
                <input
                  type="text"
                  value={config.output_dir}
                  onChange={(e) => setConfig({ ...config, output_dir: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Картинка подписи (.png)</label>
                <input
                  type="text"
                  value={config.sign_path}
                  onChange={(e) => setConfig({ ...config, sign_path: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-purple-300 mb-3">Координаты подписи</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400">X (pt)</label>
                  <input
                    type="number"
                    value={config.signature.sign_x}
                    onChange={(e) => setConfig({
                      ...config,
                      signature: { ...config.signature, sign_x: Number(e.target.value) }
                    })}
                    className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Y (pt)</label>
                  <input
                    type="number"
                    value={config.signature.sign_y}
                    onChange={(e) => setConfig({
                      ...config,
                      signature: { ...config.signature, sign_y: Number(e.target.value) }
                    })}
                    className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Ширина (pt)</label>
                  <input
                    type="number"
                    value={config.signature.sign_w}
                    onChange={(e) => setConfig({
                      ...config,
                      signature: { ...config.signature, sign_w: Number(e.target.value) }
                    })}
                    className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white mt-1"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.signature.calibration}
                      onChange={(e) => setConfig({
                        ...config,
                        signature: { ...config.signature, calibration: e.target.checked }
                      })}
                      className="w-3.5 h-3.5 rounded border-slate-500 bg-slate-700"
                    />
                    Режим калибровки
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-green-300 mb-3">Опции обработки</h4>
              <div className="space-y-2">
                {[
                  { key: 'fill_customer_table', label: 'Заполнять рамку «Технический заказчик»' },
                  { key: 'count_pages', label: 'Подсчитывать страницы' },
                  { key: 'do_merge', label: 'Склеивать титул с исходником' },
                  { key: 'do_sign', label: 'Вставлять подпись' },
                ].map((opt) => (
                  <label key={opt.key} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(config.options as any)[opt.key]}
                      onChange={(e) => setConfig({
                        ...config,
                        options: { ...config.options, [opt.key]: e.target.checked }
                      })}
                      className="w-3.5 h-3.5 rounded border-slate-500 bg-slate-700"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* JSON output */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-300">config.json</h3>
            <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden h-full">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">●</span>
                  <span className="text-sm font-mono text-slate-300">config.json</span>
                </div>
                <button
                  onClick={() => navigator.clipboard?.writeText(configJson)}
                  className="text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded bg-slate-700/50"
                >
                  📋 Копировать
                </button>
              </div>
              <pre className="p-4 overflow-auto text-sm leading-relaxed max-h-[600px]">
                <code className="text-amber-300 font-mono whitespace-pre">
                  {configJson}
                </code>
              </pre>
            </div>
          </div>
        </div>

        {/* Build command */}
        <div className="mt-12 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-blue-400">📦</span> Сборка .exe
          </h3>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
            <code className="text-sm text-green-300 font-mono break-all leading-relaxed">
              pyinstaller --noconfirm --onefile --windowed ^<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;--name "Титулы-ФП" ^<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;--add-data "config.json;." ^<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;main.py
            </code>
          </div>
          <p className="text-sm text-slate-400 mt-3">
            Результат: один файл <code className="text-blue-300">Титулы-ФП.exe</code> — готов к использованию.
          </p>
        </div>
      </div>
    </section>
  );
}
