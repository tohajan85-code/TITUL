export default function TechStack() {
  const stack = [
    {
      category: 'GUI',
      items: [
        { name: 'PySide6', desc: 'Qt для Python — основной фреймворк интерфейса', icon: '🎨' },
      ],
    },
    {
      category: 'PDF-обработка',
      items: [
        { name: 'pypdf', desc: 'Чтение/запись PDF, склейка документов', icon: '📑' },
        { name: 'pdfplumber', desc: 'Извлечение текста из PDF-титульников', icon: '🔍' },
        { name: 'reportlab', desc: 'Генерация оверлея подписи', icon: '🖊️' },
      ],
    },
    {
      category: 'DOCX',
      items: [
        { name: 'python-docx', desc: 'Чтение шаблона (справочно)', icon: '📄' },
        { name: 'pywin32', desc: 'COM-взаимодействие с MS Word', icon: '🔧' },
      ],
    },
    {
      category: 'Изображения',
      items: [
        { name: 'Pillow', desc: 'Обработка PNG подписи, удаление фона', icon: '🖼️' },
        { name: 'numpy', desc: 'Матричные операции с пикселями', icon: '🔢' },
      ],
    },
    {
      category: 'Сборка',
      items: [
        { name: 'PyInstaller', desc: 'Упаковка в один .exe файл', icon: '📦' },
      ],
    },
  ];

  return (
    <section id="tech" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Технический стек</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Python 3.10+ с набором специализированных библиотек для работы с документами
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stack.map((group) => (
            <div key={group.category} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-4">{group.category}</h3>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <div key={item.name} className="flex items-start gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="font-mono text-sm text-white">{item.name}</div>
                      <div className="text-xs text-slate-400">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Dependencies command */}
        <div className="mt-8 bg-slate-900 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-400 text-sm">▶</span>
            <span className="text-sm text-slate-400">Установка зависимостей</span>
          </div>
          <code className="text-sm text-green-300 font-mono break-all">
            pip install PySide6 pdfplumber python-docx docx2pdf pywin32 pypdf reportlab pillow numpy
          </code>
        </div>

        {/* Requirements */}
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="bg-amber-900/20 border border-amber-600/30 rounded-xl p-4">
            <h4 className="font-semibold text-amber-300 mb-2">⚠️ Требования</h4>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Windows 10/11</li>
              <li>• Установленный Microsoft Word</li>
              <li>• Python 3.10+ (для разработки)</li>
            </ul>
          </div>
          <div className="bg-green-900/20 border border-green-600/30 rounded-xl p-4">
            <h4 className="font-semibold text-green-300 mb-2">✅ Для пользователя</h4>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Титулы-ФП.exe — один файл</li>
              <li>• Microsoft Word (для COM)</li>
              <li>• config.json создаётся автоматически</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
