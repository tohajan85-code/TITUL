interface HeaderProps {
  activeSection: string;
}

export default function Header({ activeSection }: HeaderProps) {
  const navItems = [
    { id: 'hero', label: 'Главная' },
    { id: 'features', label: 'Возможности' },
    { id: 'mockup', label: 'Интерфейс' },
    { id: 'tech', label: 'Технологии' },
    { id: 'code', label: 'Код' },
    { id: 'config', label: 'Конфигурация' },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm">
            ФП
          </div>
          <span className="font-bold text-lg">Титулы-ФП</span>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                activeSection === item.id
                  ? 'bg-blue-600/30 text-blue-300'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 hidden sm:block">v1.0</span>
          <span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full border border-green-600/30">
            Windows
          </span>
        </div>
      </div>
    </header>
  );
}
