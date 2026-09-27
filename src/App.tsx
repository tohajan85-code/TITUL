import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import GuiMockup from './components/GuiMockup';
import TechStack from './components/TechStack';
import CodeViewer from './components/CodeViewer';
import ConfigSection from './components/ConfigSection';
import ProjectStructure from './components/ProjectStructure';
import DownloadButton from './components/DownloadButton';
import InstallationGuide from './components/InstallationGuide';
import Footer from './components/Footer';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'features', 'mockup', 'tech', 'code', 'config', 'structure', 'guide', 'download'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom > 100) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <Header activeSection={activeSection} />
      <main>
        <Hero />
        <Features />
        <GuiMockup />
        <TechStack />
        <CodeViewer />
        <ConfigSection />
        <ProjectStructure />
        <InstallationGuide />
        <section id="download" className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Скачать и установить</h2>
              <p className="text-slate-400 mb-8">
                Одним кликом загрузите всю структуру папок в виде ZIP-архива
              </p>
              <DownloadButton />
            </div>

            {/* Инструкция */}
            <div className="mt-12 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Пошаговая инструкция
              </h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 bg-green-600/20 border border-green-500/30 rounded-full flex items-center justify-center font-bold text-green-400">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Скачайте ZIP-архив</h4>
                    <p className="text-sm text-slate-400">
                      Нажмите кнопку выше — скачается файл <code className="text-green-300">Титулы-ФП.zip</code>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 bg-green-600/20 border border-green-500/30 rounded-full flex items-center justify-center font-bold text-green-400">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Распакуйте в нужную папку</h4>
                    <p className="text-sm text-slate-400">
                      Распакуйте содержимое в <code className="text-blue-300">E:\Титула\Программ\programm\</code>
                      <br/>
                      <span className="text-xs text-slate-500">
                        Внутри архива уже есть папка <code>programm/</code> — можно распаковать прямо в <code>E:\Титула\Программ\</code>
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 bg-green-600/20 border border-green-500/30 rounded-full flex items-center justify-center font-bold text-green-400">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Установите зависимости</h4>
                    <div className="bg-slate-900 rounded-lg p-3 mt-2">
                      <code className="text-sm text-green-300 font-mono">
                        cd E:\Титула\Программ\programm<br/>
                        pip install -r requirements.txt
                      </code>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 bg-green-600/20 border border-green-500/30 rounded-full flex items-center justify-center font-bold text-green-400">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Запустите приложение</h4>
                    <div className="bg-slate-900 rounded-lg p-3 mt-2">
                      <code className="text-sm text-green-300 font-mono">
                        python main.py
                      </code>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 bg-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center font-bold text-blue-400">
                    ★
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Бонус: собрать .exe</h4>
                    <div className="bg-slate-900 rounded-lg p-3 mt-2">
                      <code className="text-sm text-green-300 font-mono">
                        build.bat
                      </code>
                      <p className="text-xs text-slate-500 mt-1">
                        Или вручную: <code>pyinstaller Титулы-ФП.spec</code>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Альтернативные способы */}
            <div className="mt-8 grid md:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <h4 className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
                  💻 Через проводник Windows
                </h4>
                <ol className="text-sm text-slate-400 space-y-1 list-decimal list-inside">
                  <li>Скачайте ZIP-архив</li>
                  <li>Правый клик → «Извлечь всё...»</li>
                  <li>Укажите путь: <code className="text-blue-300">E:\Титула\Программ</code></li>
                  <li>Готово — папка <code>programm</code> создана</li>
                </ol>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <h4 className="font-semibold text-purple-300 mb-2 flex items-center gap-2">
                  ⌨️ Через командную строку
                </h4>
                <div className="bg-slate-900 rounded-lg p-3 mt-2">
                  <code className="text-xs text-green-300 font-mono block">
                    mkdir E:\Титула\Программ<br/>
                    cd E:\Титула\Программ<br/>
                    :: Распакуйте ZIP сюда<br/>
                    pip install -r programm\requirements.txt
                  </code>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
