export default function Hero() {
  return (
    <section id="hero" className="pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-blue-300 text-sm mb-8">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Автоматизация рабочей документации
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
          Титулы-ФП
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-300 mb-4 max-w-3xl mx-auto">
          GUI-приложение для автоматизации обработки титульных листов рабочей документации
        </p>
        
        <p className="text-slate-400 mb-10 max-w-2xl mx-auto">
          Заполнение титульного листа Word по данным из PDF-титульника раздела, 
          формирование итоговых PDF-файлов, вставка подписи с предварительным просмотром
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <a href="/install.html" target="_blank" className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl font-medium transition-all shadow-lg shadow-green-600/20 hover:shadow-green-500/30">
            ⬇ Скачать и установить
          </a>
          <a href="#mockup" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30">
            Смотреть интерфейс
          </a>
          <a href="#features" className="px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded-xl font-medium transition-all">
            Возможности
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { value: '36+', label: 'папок за прогон' },
            { value: '4', label: 'модуля обработки' },
            { value: '100%', label: 'автоматизация' },
            { value: '.exe', label: 'один файл' },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-400">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
