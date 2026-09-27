export default function Features() {
  const features = [
    {
      icon: '📄',
      title: 'Извлечение данных из PDF',
      description: 'Автоматическое извлечение названия раздела, описания комплекта, шифра и числа страниц из PDF-титульника',
      color: 'from-blue-500/20 to-blue-600/10',
      border: 'border-blue-500/30'
    },
    {
      icon: '📝',
      title: 'Заполнение шаблона Word',
      description: 'Заполнение титульного листа Word через COM-интерфейс с заменой плейсхолдеров {{SECTION_NAME}}, {{PAGES}} и др.',
      color: 'from-purple-500/20 to-purple-600/10',
      border: 'border-purple-500/30'
    },
    {
      icon: '🔗',
      title: 'Склейка PDF',
      description: 'Объединение титульного листа и исходного документа в единый PDF-файл с суффиксом _ФП',
      color: 'from-green-500/20 to-green-600/10',
      border: 'border-green-500/30'
    },
    {
      icon: '✍️',
      title: 'Вставка подписи',
      description: 'Наложение подписи на первую страницу PDF с предварительным визуальным просмотром и калибровкой положения',
      color: 'from-amber-500/20 to-amber-600/10',
      border: 'border-amber-500/30'
    },
    {
      icon: '👁️',
      title: 'Предпросмотр подписи',
      description: 'Интерактивный предпросмотр с управлением координатами (X, Y, ширина, высота) и режимом калибровки',
      color: 'from-rose-500/20 to-rose-600/10',
      border: 'border-rose-500/30'
    },
    {
      icon: '⚙️',
      title: 'Гибкая конфигурация',
      description: 'Чекбоксы для включения/отключения подсчёта страниц, заполнения рамки «Технический заказчик», удаления разрывов',
      color: 'from-cyan-500/20 to-cyan-600/10',
      border: 'border-cyan-500/30'
    },
  ];

  return (
    <section id="features" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Возможности</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Полный цикл обработки титульных листов — от извлечения данных из PDF до формирования готовых документов с подписью
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`bg-gradient-to-br ${feature.color} border ${feature.border} rounded-2xl p-6 hover:scale-[1.02] transition-transform`}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-blue-400">▶</span> Полный цикл обработки
          </h3>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { step: '1', text: 'Копирование дерева папок' },
              { step: '2', text: 'Извлечение данных из PDF' },
              { step: '3', text: 'Заполнение шаблона Word' },
              { step: '4', text: 'Склейка титул + исходник' },
              { step: '5', text: 'Вставка подписи' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center font-bold text-blue-400 mb-2">
                  {item.step}
                </div>
                <span className="text-sm text-slate-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
