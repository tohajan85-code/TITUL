import { useState } from 'react';

const codeModules = [
  {
    id: 'extract',
    name: 'extract_pdf.py',
    desc: 'Извлечение данных из PDF',
    code: `import pdfplumber

def extract_pdf_info(pdf_path):
    """Возвращает (name, desc, code, total_pages)."""
    with pdfplumber.open(pdf_path) as pdf:
        total_pages = len(pdf.pages)
        text = pdf.pages[0].extract_text()
        if not text:
            return None, None, None, None
        lines = text.split('\\n')
        start_idx, end_idx = -1, -1
        for i, line in enumerate(lines):
            if "РАБОЧАЯ ДОКУМЕНТАЦИЯ" in line:
                start_idx = i
            if any(s in line for s in ["Генеральный директор",
                    "г. Москва", "Заказчик", "Санкт-Петербург"]):
                if start_idx != -1 and end_idx == -1:
                    end_idx = i
                    break
        if start_idx == -1 or end_idx == -1:
            return None, None, None, total_pages
        block = [l.strip() for l in lines[start_idx+1:end_idx]
                 if l.strip()]
        if not block:
            return None, None, None, total_pages
        code = block[-1]
        remaining = block[:-1]
        desc, name_parts = "", []
        for line in remaining:
            if any(k in line.lower() for k in
                   ["комплект", "чертеж", "документац"]):
                desc = line
            else:
                name_parts.append(line)
        name = "\\n".join(name_parts)
        return name, desc, code, total_pages`
  },
  {
    id: 'word',
    name: 'word_fill.py',
    desc: 'Заполнение титула через Word COM',
    code: `import os, logging, time
import win32com.client as win32
import pythoncom

def to_word(text):
    """Преобразует '\\n' в мягкий разрыв строки Word."""
    if text is None:
        return ''
    return str(text).replace('\\n', chr(11))

def replace_all(doc, find_text, replace_text):
    """Замена во всех StoryRanges + Shapes + Headers/Footers."""
    count = 0
    for story in doc.StoryRanges:
        rng = story
        while rng is not None:
            try:
                if find_text in rng.Text:
                    f = rng.Find
                    f.ClearFormatting()
                    f.Replacement.ClearFormatting()
                    if f.Execute(find_text, True, False, False,
                                 False, False, True, 1, False,
                                 to_word(replace_text), 2):
                        count += 1
            except Exception:
                pass
            try:
                rng = rng.NextStoryRange
            except Exception:
                break
    count += scan_shapes(doc.Shapes, find_text, replace_text)
    return count

def process_file(word, template_path, pdf_path, out_folder,
                 fill_customer_table=True, count_pages=True):
    """Основная обработка одного файла."""
    from extract_pdf import extract_pdf_info
    name, desc, code, pages = extract_pdf_info(pdf_path)
    if not name or not code or pages is None:
        return True, word
    
    total = (pages + 1) if count_pages else ""
    parts = code.split('-')
    short = parts[-1].strip() if len(parts) > 1 else code
    base = f"3_Т_ФП_Р_{short}"
    
    doc = word.Documents.Open(template_path, ReadOnly=False)
    pairs = [
        ("{{SECTION_NAME 1}}", name),
        ("{{SECTION_NAME 2}}", desc),
        ("{{SECTION_NAME 3}}", code),
    ]
    if fill_customer_table and count_pages:
        pairs.append(("{{PAGES}}", str(total)))
    
    for find_text, repl in pairs:
        replace_all(doc, find_text, repl)
    
    docx_out = os.path.join(out_folder, base + ".docx")
    pdf_out = os.path.join(out_folder, base + ".pdf")
    doc.SaveAs2(docx_out, FileFormat=16)
    doc.SaveAs2(pdf_out, FileFormat=17)
    doc.Close(SaveChanges=False)
    return True, word`
  },
  {
    id: 'merge',
    name: 'merge.py',
    desc: 'Склейка титула и исходника',
    code: `import os
from pypdf import PdfWriter, PdfReader

def find_title_and_source(folder):
    """Находит титул (3_Т_ФП_Р_*) и исходник в папке."""
    files = sorted(os.listdir(folder))
    title, source = None, None
    for f in files:
        full = os.path.join(folder, f)
        if not (os.path.isfile(full) and f.lower().endswith('.pdf')):
            continue
        no_ext = os.path.splitext(f)[0]
        if no_ext.startswith('3_Т_ФП_Р_'):
            if title is None:
                title = full
            continue
        if no_ext.endswith('_ФП') or no_ext.endswith('_Подпись'):
            continue
        if source is None:
            source = full
    return title, source

def merge_pdfs(title_path, source_path, output_path):
    """Объединяет титул + исходник в один PDF."""
    writer = PdfWriter()
    for p in PdfReader(title_path).pages:
        writer.add_page(p)
    for p in PdfReader(source_path).pages:
        writer.add_page(p)
    with open(output_path, "wb") as f:
        writer.write(f)
    return True

def process_folder(folder):
    title, source = find_title_and_source(folder)
    if not title or not source:
        return False
    src_base = os.path.splitext(os.path.basename(source))[0]
    out_path = os.path.join(folder, f"{src_base}_ФП.pdf")
    return merge_pdfs(title, source, out_path)`
  },
  {
    id: 'signature',
    name: 'signature.py',
    desc: 'Вставка подписи в PDF',
    code: `import os
from io import BytesIO
import numpy as np
from PIL import Image
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader

def prepare_signature(path):
    """Убирает белый фон, обрезает поля подписи."""
    img = Image.open(path).convert("RGBA")
    arr = np.array(img)
    r, g, b = arr[:,:,0], arr[:,:,1], arr[:,:,2]
    white = (r > 235) & (g > 235) & (b > 235)
    arr[white, 3] = 0
    
    alpha = arr[:,:,3]
    nonempty = np.argwhere(alpha > 10)
    if len(nonempty) > 0:
        y0, x0 = nonempty.min(axis=0)
        y1, x1 = nonempty.max(axis=0)
        arr = arr[y0:y1+1, x0:x1+1]
    
    out = Image.fromarray(arr)
    buf = BytesIO()
    out.save(buf, format="PNG")
    buf.seek(0)
    return buf, arr.shape[1], arr.shape[0]

def make_overlay(sign_path, config):
    """Создаёт PDF-страницу с подписью или рамкой калибровки."""
    img_buf, w_px, h_px = prepare_signature(sign_path)
    h_pt = config["sign_w"] * h_px / w_px
    
    buf = BytesIO()
    c = canvas.Canvas(buf, pagesize=A4)
    if config.get("calibration"):
        c.setStrokeColorRGB(1, 0, 0)
        c.setLineWidth(1)
        c.rect(config["sign_x"], config["sign_y"],
               config["sign_w"], h_pt)
    else:
        c.drawImage(ImageReader(img_buf),
                    config["sign_x"], config["sign_y"],
                    width=config["sign_w"], height=h_pt,
                    mask='auto')
    c.save()
    buf.seek(0)
    return PdfReader(buf).pages[0]

def sign_pdf(src_path, dst_path, overlay):
    """Накладывает оверлей на первую страницу PDF."""
    reader = PdfReader(src_path)
    writer = PdfWriter()
    for i, page in enumerate(reader.pages):
        if i == 0:
            page.merge_page(overlay)
        writer.add_page(page)
    with open(dst_path, "wb") as f:
        writer.write(f)`
  },
  {
    id: 'pipeline',
    name: 'pipeline.py',
    desc: 'Основной конвейер обработки',
    code: `import os, shutil, logging
from extract_pdf import extract_pdf_info
from word_fill import open_word, process_file
from merge import process_folder as merge_folder
from signature import make_overlay, sign_pdf

def mirror_tree(src, dst, overwrite=False):
    """Копирует дерево папок src → dst."""
    for root, dirs, files in os.walk(src):
        rel = os.path.relpath(root, src)
        target_dir = dst if rel == "." else os.path.join(dst, rel)
        os.makedirs(target_dir, exist_ok=True)
        for f in files:
            s = os.path.join(root, f)
            d = os.path.join(target_dir, f)
            if os.path.exists(d) and not overwrite:
                continue
            shutil.copy2(s, d)

def run_full(input_dir, output_dir, template_path,
             fill_customer_table=True, count_pages=True,
             do_merge=True, do_sign=False,
             sign_path=None, sign_config=None):
    """Основной конвейер обработки."""
    import pythoncom
    pythoncom.CoInitialize()
    word = open_word()
    
    mirror_tree(input_dir, output_dir)
    
    overlay = None
    if do_sign and sign_path:
        overlay = make_overlay(sign_path, sign_config)
    
    processed = 0
    try:
        for root, dirs, files in os.walk(input_dir):
            pdf_name = find_first_pdf(root)
            if not pdf_name:
                continue
            
            rel_path = os.path.relpath(root, input_dir)
            out_folder = output_dir if rel_path == "." \\
                else os.path.join(output_dir, rel_path)
            
            pdf_path = os.path.join(root, pdf_name)
            ok, word = process_file(
                word, template_path, pdf_path, out_folder,
                fill_customer_table, count_pages)
            if not ok:
                continue
            processed += 1
            
            if do_merge:
                merge_folder(out_folder)
            
            if do_sign and overlay:
                # Вставка подписи в _ФП.pdf
                ...
    finally:
        word.Quit()
        pythoncom.CoUninitialize()
    
    return True`
  },
];

export default function CodeViewer() {
  const [activeModule, setActiveModule] = useState('extract');
  const activeCode = codeModules.find((m) => m.id === activeModule);

  return (
    <section id="code" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Модули программы</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Исходный код разделён на 5 модулей с чёткой ответственностью каждого
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {codeModules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                activeModule === mod.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              <span className="font-mono">{mod.name}</span>
              <span className="hidden sm:inline text-xs ml-2 opacity-70">— {mod.desc}</span>
            </button>
          ))}
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <span className="text-green-400">●</span>
              <span className="text-sm font-mono text-slate-300">{activeCode?.name}</span>
            </div>
            <span className="text-xs text-slate-500">Python 3.10+</span>
          </div>
          <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
            <code className="text-green-300 font-mono whitespace-pre">
              {activeCode?.code}
            </code>
          </pre>
        </div>

        {/* Module architecture diagram */}
        <div className="mt-8 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Архитектура модулей</h3>
          <div className="flex flex-wrap justify-center items-center gap-3 text-sm">
            <div className="px-3 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-300">
              extract_pdf.py
            </div>
            <span className="text-slate-500">→</span>
            <div className="px-3 py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-300">
              word_fill.py
            </div>
            <span className="text-slate-500">→</span>
            <div className="px-3 py-2 bg-green-600/20 border border-green-500/30 rounded-lg text-green-300">
              merge.py
            </div>
            <span className="text-slate-500">→</span>
            <div className="px-3 py-2 bg-amber-600/20 border border-amber-500/30 rounded-lg text-amber-300">
              signature.py
            </div>
            <span className="text-slate-500">→</span>
            <div className="px-3 py-2 bg-rose-600/20 border border-rose-500/30 rounded-lg text-rose-300 font-semibold">
              pipeline.py
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
