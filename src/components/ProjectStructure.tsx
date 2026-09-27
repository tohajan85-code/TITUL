import { useState } from 'react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  desc?: string;
  children?: FileNode[];
}

const projectTree: FileNode[] = [
  {
    name: 'programm/',
    type: 'folder',
    desc: 'Корень проекта (E:\\Титула\\Программ\\programm)',
    children: [
      { name: 'main.py', type: 'file', desc: 'Точка входа приложения' },
      { name: 'config.json', type: 'file', desc: 'Конфигурация (создаётся автоматически)' },
      { name: 'requirements.txt', type: 'file', desc: 'Зависимости Python' },
      { name: 'README.md', type: 'file', desc: 'Документация проекта' },
      { name: 'build.bat', type: 'file', desc: 'Скрипт сборки .exe' },
      { name: 'Титулы-ФП.spec', type: 'file', desc: 'Спецификация PyInstaller' },
      { name: 'test_modules.py', type: 'file', desc: 'Тесты модулей' },
      { name: '.gitignore', type: 'file', desc: 'Игнор для Git' },
      {
        name: 'modules/',
        type: 'folder',
        desc: 'Основные модули обработки',
        children: [
          { name: '__init__.py', type: 'file', desc: 'Инициализация пакета' },
          { name: 'extract_pdf.py', type: 'file', desc: 'Извлечение данных из PDF-титульников' },
          { name: 'word_fill.py', type: 'file', desc: 'Заполнение Word через COM-интерфейс' },
          { name: 'merge.py', type: 'file', desc: 'Склейка титула и исходника в PDF' },
          { name: 'signature.py', type: 'file', desc: 'Вставка подписи в PDF' },
          { name: 'pipeline.py', type: 'file', desc: 'Основной конвейер обработки' },
          { name: 'preview.py', type: 'file', desc: 'Рендеринг предпросмотра PDF' },
        ],
      },
      {
        name: 'ui/',
        type: 'folder',
        desc: 'Интерфейс PySide6',
        children: [
          { name: '__init__.py', type: 'file', desc: 'Инициализация пакета' },
          { name: 'main_window.py', type: 'file', desc: 'Главное окно (3 колонки)' },
          { name: 'preview_widget.py', type: 'file', desc: 'Виджет предпросмотра подписи' },
          { name: 'log_handler.py', type: 'file', desc: 'Обработчик логов для GUI' },
        ],
      },
      {
        name: 'utils/',
        type: 'folder',
        desc: 'Вспомогательные утилиты',
        children: [
          { name: '__init__.py', type: 'file', desc: 'Инициализация пакета' },
          { name: 'config.py', type: 'file', desc: 'Чтение/запись config.json' },
          { name: 'logger.py', type: 'file', desc: 'Настройка логирования' },
        ],
      },
      {
        name: 'resources/',
        type: 'folder',
        desc: 'Ресурсы (иконки, шаблоны)',
        children: [
          { name: 'README.md', type: 'file', desc: 'Описание папки ресурсов' },
        ],
      },
    ],
  },
];

function TreeNode({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const [expanded, setExpanded] = useState(true);
  const isFolder = node.type === 'folder';
  const hasChildren = isFolder && node.children && node.children.length > 0;

  const icon = isFolder
    ? (expanded ? '📂' : '📁')
    : getFileIcon(node.name);

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-slate-700/30 transition-colors ${
          depth === 0 ? 'font-semibold' : ''
        }`}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren && (
          <span className="text-slate-500 text-xs w-3">
            {expanded ? '▼' : '▶'}
          </span>
        )}
        {!hasChildren && <span className="w-3"></span>}
        <span className="text-lg">{icon}</span>
        <span className={`font-mono text-sm ${isFolder ? 'text-blue-300' : 'text-slate-200'}`}>
          {node.name}
        </span>
        {node.desc && (
          <span className="text-xs text-slate-500 ml-2 hidden sm:inline">
            — {node.desc}
          </span>
        )}
      </div>
      {hasChildren && expanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNode key={child.name} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function getFileIcon(name: string): string {
  if (name.endsWith('.py')) return '🐍';
  if (name.endsWith('.json')) return '📋';
  if (name.endsWith('.md')) return '📝';
  if (name.endsWith('.txt')) return '📃';
  if (name.endsWith('.bat')) return '⚡';
  if (name.endsWith('.spec')) return '📦';
  if (name.endsWith('.gitignore')) return '🔒';
  return '📄';
}

export default function ProjectStructure() {
  return (
    <section id="structure" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Структура проекта</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Папка <code className="text-blue-300">E:\Титула\Программ\programm</code> — 
            полная структура файлов приложения
          </p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700/50">
            <span className="text-xl">🗂️</span>
            <span className="font-mono text-sm text-slate-300">
              E:\Титула\Программ\programm\
            </span>
          </div>
          
          <div className="space-y-0">
            {projectTree.map((node) => (
              <TreeNode key={node.name} node={node} />
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-blue-900/20 border border-blue-600/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">7</div>
            <div className="text-sm text-slate-400">модулей обработки</div>
          </div>
          <div className="bg-purple-900/20 border border-purple-600/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">4</div>
            <div className="text-sm text-slate-400">модуля UI</div>
          </div>
          <div className="bg-green-900/20 border border-green-600/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">3</div>
            <div className="text-sm text-slate-400">утилиты</div>
          </div>
        </div>

        {/* Quick start */}
        <div className="mt-8 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">🚀 Быстрый старт</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="bg-blue-600/20 border border-blue-500/30 rounded-full w-6 h-6 flex items-center justify-center text-xs text-blue-300 shrink-0">1</span>
              <div>
                <code className="text-sm text-green-300 font-mono">pip install -r requirements.txt</code>
                <p className="text-xs text-slate-400 mt-1">Установка зависимостей</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-blue-600/20 border border-blue-500/30 rounded-full w-6 h-6 flex items-center justify-center text-xs text-blue-300 shrink-0">2</span>
              <div>
                <code className="text-sm text-green-300 font-mono">python main.py</code>
                <p className="text-xs text-slate-400 mt-1">Запуск приложения</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-blue-600/20 border border-blue-500/30 rounded-full w-6 h-6 flex items-center justify-center text-xs text-blue-300 shrink-0">3</span>
              <div>
                <code className="text-sm text-green-300 font-mono">build.bat</code>
                <p className="text-xs text-slate-400 mt-1">Сборка в .exe (опционально)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
