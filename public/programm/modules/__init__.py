"""
Модули обработки документов.
"""

from .extract_pdf import extract_pdf_info
from .word_fill import open_word, process_file
from .merge import process_folder as merge_folder
from .signature import make_overlay, sign_pdf
from .pipeline import run_full

__all__ = [
    'extract_pdf_info',
    'open_word',
    'process_file',
    'merge_folder',
    'make_overlay',
    'sign_pdf',
    'run_full',
]
