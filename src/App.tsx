import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import GuiMockup from './components/GuiMockup';
import TechStack from './components/TechStack';
import CodeViewer from './components/CodeViewer';
import ConfigSection from './components/ConfigSection';
import ProjectStructure from './components/ProjectStructure';
import Footer from './components/Footer';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'features', 'mockup', 'tech', 'code', 'config', 'structure'];
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
      </main>
      <Footer />
    </div>
  );
}
