"""
Модуль заполнения титульного листа через COM-интерфейс MS Word.

Открывает шаблон .docx, заменяет плейсхолдеры, сохраняет результат.
"""

import os
import logging
import time

try:
    import win32com.client as win32
    import pythoncom
    HAS_WIN32 = True
except ImportError:
    HAS_WIN32 = False
    logging.warning("pywin32 не установлен. Работа с Word COM недоступна.")


def to_word(text: str) -> str:
    """
    Преобразует '\\n' в мягкий разрыв строки Word (chr(11)).
    
    Args:
        text: Исходный текст.
        
    Returns:
        Текст с заменёнными переносами.
    """
    if text is None:
        return ''
    return str(text).replace('\n', chr(11))


def escape_wildcards(text: str) -> str:
    """
    Экранирует специальные символы для поиска Word с wildcards.
    
    Args:
        text: Исходный текст.
        
    Returns:
        Экранированный текст.
    """
    special_chars = "?*[]{}().@<>^#"
    out = ''
    for ch in text:
        if ch in special_chars:
            out += '\\' + ch
        else:
            out += ch
    return out


def replace_in_range(rng, find_text: str, replace_text: str,
                     use_wildcards: bool = False) -> bool:
    """
    Выполняет замену текста в заданном диапазоне Word.
    
    Args:
        rng: Объект Range Word.
        find_text: Искомый текст.
        replace_text: Текст замены.
        use_wildcards: Использовать ли wildcards.
        
    Returns:
        True если замена выполнена.
    """
    try:
        f = rng.Find
        f.ClearFormatting()
        f.Replacement.ClearFormatting()
        pattern = escape_wildcards(find_text) if use_wildcards else find_text
        return bool(f.Execute(
            pattern,       # FindText
            True,          # MatchCase
            False,         # MatchWholeWord
            use_wildcards, # MatchWildcards
            False,         # MatchSoundsLike
            False,         # MatchAllWordForms
            True,          # Forward
            1,             # Wrap (wdFindContinue)
            False,         # Format
            to_word(replace_text),  # ReplaceWith
            2              # Replace (wdReplaceAll)
        ))
    except Exception as e:
        logging.warning(f"Range.Find ошибка: {e}")
        return False


def scan_shapes(shapes, find_text: str, replace_text: str) -> int:
    """
    Рекурсивно сканирует Shapes (включая группы) и заменяет текст.
    
    Args:
        shapes: Коллекция Shapes Word.
        find_text: Искомый текст.
        replace_text: Текст замены.
        
    Returns:
        Число выполненных замен.
    """
    count = 0
    for i in range(1, shapes.Count + 1):
        try:
            sh = shapes.Item(i)
        except Exception:
            continue
        
        # Проверка текстового фрейма
        try:
            if sh.TextFrame and sh.TextFrame.HasText:
                tr = sh.TextFrame.TextRange
                if find_text in tr.Text:
                    if replace_in_range(tr, find_text, replace_text, False):
                        count += 1
                    elif replace_in_range(tr, find_text, replace_text, True):
                        count += 1
        except Exception:
            pass
        
        # Рекурсия в группы (Type == 6 = msoGroup)
        try:
            if sh.Type == 6:
                count += scan_shapes(sh.GroupItems, find_text, replace_text)
        except Exception:
            pass
    
    return count


def replace_all(doc, find_text: str, replace_text: str) -> int:
    """
    Заменяет текст во всём документе: StoryRanges, Shapes, Headers, Footers.
    
    Args:
        doc: Объект Document Word.
        find_text: Искомый текст (плейсхолдер).
        replace_text: Текст замены.
        
    Returns:
        Общее число выполненных замен.
    """
    count = 0
    
    # Замена в основных StoryRanges
    for story in doc.StoryRanges:
        rng = story
        while rng is not None:
            try:
                if find_text in rng.Text:
                    if replace_in_range(rng, find_text, replace_text, False):
                        count += 1
                    elif replace_in_range(rng, find_text, replace_text, True):
                        count += 1
            except Exception:
                pass
            try:
                rng = rng.NextStoryRange
            except Exception:
                break
    
    # Замена в Shapes
    count += scan_shapes(doc.Shapes, find_text, replace_text)
    
    # Замена в Headers и Footers всех секций
    for si in range(1, doc.Sections.Count + 1):
        sec = doc.Sections(si)
        for hi in range(1, 4):  # wdHeaderFooterPrimary, FirstPage, EvenPages
            try:
                count += scan_shapes(
                    sec.Headers(hi).Shapes, find_text, replace_text
                )
            except Exception:
                pass
            try:
                count += scan_shapes(
                    sec.Footers(hi).Shapes, find_text, replace_text
                )
            except Exception:
                pass
    
    return count


def remove_extra_empty_before_name(doc, name: str) -> int:
    """
    Убирает лишние пустые абзацы над названием для многострочных имён.
    
    Args:
        doc: Объект Document Word.
        name: Название раздела (может содержать \\n).
        
    Returns:
        Число удалённых пустых абзацев.
    """
    extra = name.count('\n')
    if extra <= 0:
        return 0
    
    # Поиск маркера
    marker_idx = None
    for i in range(1, doc.Paragraphs.Count + 1):
        if "{{SECTION_NAME 1}}" in doc.Paragraphs(i).Range.Text:
            marker_idx = i
            break
    
    if marker_idx is None or marker_idx <= 1:
        return 0
    
    # Удаление пустых абзацев перед маркером
    removed = 0
    j = marker_idx - 1
    while j >= 1 and removed < extra:
        prev = doc.Paragraphs(j)
        txt = prev.Range.Text
        if txt.strip() == '' or txt.strip() == '\x07':
            prev.Range.Delete()
            removed += 1
            j -= 1
        else:
            break
    
    return removed


def remove_page_breaks(doc) -> tuple:
    """
    Снимает явные разрывы страниц и атрибут «с новой страницы».
    
    Args:
        doc: Объект Document Word.
        
    Returns:
        (removed_breaks, removed_before) — число удалённых разрывов.
    """
    removed_breaks = 0
    removed_before = 0
    
    # Удаление символов разрыва страницы (^m)
    try:
        rng = doc.Content
        f = rng.Find
        f.ClearFormatting()
        f.Replacement.ClearFormatting()
        f.Text = "^m"
        f.Replacement.Text = ""
        f.Forward = True
        f.Wrap = 1  # wdFindContinue
        f.MatchCase = False
        f.MatchWildcards = False
        f.Format = False
        
        while f.Execute(FindText="^m", ReplaceWith="", Replace=0):
            removed_breaks += 1
            if removed_breaks > 100:
                break
        
        if removed_breaks:
            f.Execute(Replace=2)  # wdReplaceAll
    except Exception as e:
        logging.warning(f"Удаление разрывов страниц: {e}")
    
    # Снятие атрибута PageBreakBefore
    for i in range(1, doc.Paragraphs.Count + 1):
        try:
            pf = doc.Paragraphs(i).Format
            if pf.PageBreakBefore:
                pf.PageBreakBefore = False
                removed_before += 1
        except Exception:
            pass
    
    return removed_breaks, removed_before


def open_word():
    """
    Открывает невидимый экземпляр MS Word через COM.
    
    Returns:
        Объект Word.Application.
    """
    if not HAS_WIN32:
        raise RuntimeError("pywin32 не установлен. Установите: pip install pywin32")
    
    word = win32.Dispatch('Word.Application')
    word.Visible = False
    word.DisplayAlerts = 0  # wdAlertsNone
    return word


def process_file(word, template_path: str, pdf_path: str, out_folder: str,
                 fill_customer_table: bool = True,
                 count_pages: bool = True,
                 remove_breaks_flag: bool = True) -> tuple:
    """
    Обрабатывает один файл: извлекает данные, заполняет шаблон, сохраняет.
    
    Args:
        word: Объект Word.Application.
        template_path: Путь к шаблону .docx.
        pdf_path: Путь к исходному PDF.
        out_folder: Папка для сохранения результата.
        fill_customer_table: Заполнять ли рамку «Технический заказчик».
        count_pages: Подсчитывать ли страницы ({{PAGES}} = PDF + 1).
        remove_breaks_flag: Удалять ли разрывы страниц.
        
    Returns:
        (ok, word) — успех операции и (возможно обновлённый) объект Word.
    """
    from .extract_pdf import extract_pdf_info
    
    name, desc, code, pages = extract_pdf_info(pdf_path)
    
    if not name or not code or pages is None:
        logging.warning(f"Пропуск (нет данных): {pdf_path}")
        return True, word
    
    # Вычисление числа страниц
    total = (pages + 1) if count_pages else ""
    
    # Формирование имени выходного файла из шифра
    parts = code.split('-')
    short = parts[-1].strip() if len(parts) > 1 else code
    base = f"3_Т_ФП_Р_{short}"
    docx_out = os.path.join(out_folder, base + ".docx")
    pdf_out = os.path.join(out_folder, base + ".pdf")
    
    # Удаление старых файлов
    for p in (docx_out, pdf_out):
        if os.path.exists(p):
            try:
                os.remove(p)
            except Exception:
                pass
    
    # Обработка с повторной попыткой при сбое
    for attempt in range(2):
        doc = None
        try:
            doc = word.Documents.Open(template_path, ReadOnly=False)
            
            # Удаление лишних пустых абзацев
            remove_extra_empty_before_name(doc, name)
            
            # Пары замены
            pairs = [
                ("{{SECTION_NAME 1}}", name),
                ("{{SECTION_NAME 2}}", desc),
                ("{{SECTION_NAME 3}}", code),
            ]
            if fill_customer_table and count_pages:
                pairs.append(("{{PAGES}}", str(total)))
            
            # Выполнение замен
            for find_text, repl in pairs:
                n = replace_all(doc, find_text, repl)
                logging.info(f"  {find_text} → {repl!r}: попаданий = {n}")
            
            # Удаление разрывов страниц
            if remove_breaks_flag:
                rb, rbb = remove_page_breaks(doc)
                if rb or rbb:
                    logging.info(f"  Удалено разрывов: {rb}, атрибутов: {rbb}")
            
            # Сохранение
            doc.SaveAs2(docx_out, FileFormat=16)  # wdFormatXMLDocument
            doc.SaveAs2(pdf_out, FileFormat=17)   # wdFormatPDF
            doc.Close(SaveChanges=False)
            
            logging.info(f"  Сохранено: {docx_out}")
            logging.info(f"  Сохранено: {pdf_out}")
            return True, word
            
        except Exception as e:
            logging.warning(f"Попытка {attempt + 1} не удалась: {e}")
            try:
                if doc is not None:
                    doc.Close(SaveChanges=False)
            except Exception:
                pass
            
            # Перезапуск Word при серьёзной ошибке
            try:
                word.Quit()
            except Exception:
                pass
            time.sleep(1)
            
            try:
                word = open_word()
            except Exception:
                pass
    
    logging.error(f"Не удалось обработать: {pdf_path}")
    return False, word
