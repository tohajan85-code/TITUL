export default function Footer() {
  return (
    <footer className="border-t border-slate-700/50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center font-bold text-[10px]">
                ФП
              </div>
              <span className="font-bold">Титулы-ФП</span>
            </div>
            <p className="text-sm text-slate-400">
              Автоматизация обработки титульных листов рабочей документации для Windows.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm mb-3">Критерии приёмки</h4>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>✅ 36 папок за один прогон</li>
              <li>✅ .docx + .pdf + _ФП.pdf + _Подпись.pdf</li>
              <li>✅ Предпросмотр подписи с калибровкой</li>
              <li>✅ Перезапись без дублирования</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Обработка ошибок</h4>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• Перезапуск Word при сбое COM</li>
              <li>• Пропуск файлов без данных</li>
              <li>• Логирование всех операций</li>
              <li>• Диалоги при отсутствии файлов</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700/50 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-500">
            Титулы-ФП v1.0 — Техническое задание на разработку
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>Python 3.10+</span>
            <span>•</span>
            <span>PySide6</span>
            <span>•</span>
            <span>Windows</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
