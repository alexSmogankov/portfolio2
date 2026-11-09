import html
import json
import math
import os
from pathlib import Path
import subprocess

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'assets' / 'portfolio'
WIDTH, HEIGHT = A4
INK = HexColor('#202a2c')
MUTED = HexColor('#536365')
ACCENT = HexColor('#226c64')
LINE = HexColor('#d8e0dc')


# Загружает тот же каталог, который используется на сайте.
def load_catalog():
    module = (ROOT / 'js' / 'projects.mjs').as_uri()
    code = f'import {{ projects, categories, clients }} from {json.dumps(module)}; console.log(JSON.stringify({{ projects, categories, clients }}));'
    return json.loads(subprocess.check_output(['node', '--input-type=module', '-e', code], encoding='utf-8'))


# Регистрирует шрифты с кириллицей из системы или указанного каталога.
def register_fonts():
    folder = Path(os.environ.get('PORTFOLIO_FONT_DIR', 'C:/Windows/Fonts'))
    regular, bold = folder / 'segoeui.ttf', folder / 'segoeuib.ttf'
    if not regular.exists():
        folder = Path('/usr/share/fonts/truetype/dejavu')
        regular, bold = folder / 'DejaVuSans.ttf', folder / 'DejaVuSans-Bold.ttf'
    pdfmetrics.registerFont(TTFont('Portfolio', str(regular)))
    pdfmetrics.registerFont(TTFont('PortfolioBold', str(bold)))


# Выводит абзац от верхней координаты и проверяет доступную высоту.
def paragraph(pdf, text, x, top, width, size=9.3, color=INK, bold=False, max_height=80):
    clean = text.replace('—', '-').replace('–', '-').replace('\u2011', '-')
    style = ParagraphStyle('text', fontName='PortfolioBold' if bold else 'Portfolio', fontSize=size, leading=size * 1.5, textColor=color)
    item = Paragraph(html.escape(clean), style)
    _, height = item.wrap(width, max_height)
    if height > max_height:
        raise ValueError(f'PDF paragraph exceeds its space: {clean}')
    item.drawOn(pdf, x, top - height)
    return top - height


# Рисует повторяемые шапку, контакты и номер страницы.
def draw_page_frame(pdf, lang, page_number, total_pages, count, clients):
    pdf.setFillColor(HexColor('#f7f9f6'))
    pdf.rect(0, 0, WIDTH, HEIGHT, fill=1, stroke=0)
    pdf.setFillColor(HexColor('#101315'))
    pdf.rect(0, HEIGHT - 100, WIDTH, 100, fill=1, stroke=0)
    name = 'Алексей Сможанков' if lang == 'ru' else 'Alexey Smozhankov'
    paragraph(pdf, name, 42, HEIGHT - 24, 390, 22, HexColor('#f1f3ef'), True, 40)
    paragraph(pdf, 'PLAYABLE ADS DEVELOPER', 43, HEIGHT - 58, 350, 8.5, HexColor('#7de8dc'), True, 20)
    facts = f'{count} демо / 2D + 3D / сцены, анимация, подбор звуков / PixiJS + Three.js + Blender' if lang == 'ru' else f'{count} demos / 2D + 3D / scenes, animation, sound selection / PixiJS + Three.js + Blender'
    paragraph(pdf, facts, 43, HEIGHT - 77, WIDTH - 85, 8, HexColor('#b8c4c5'), False, 20)
    client_label = 'Заказчики: ' if lang == 'ru' else 'Clients: '
    paragraph(pdf, client_label + ' / '.join(clients), 42, 85, WIDTH - 84, 7.5, MUTED, False, 16)
    pdf.setStrokeColor(LINE)
    pdf.line(42, 64, WIDTH - 42, 64)
    pdf.setFont('Portfolio', 8)
    pdf.setFillColor(INK)
    pdf.drawString(42, 44, 'alexsmogankou@gmail.com')
    pdf.linkURL('mailto:alexsmogankou@gmail.com', (42, 40, 170, 53), relative=0)
    pdf.drawString(206, 44, 'Telegram / @silvestr112233')
    pdf.linkURL('https://t.me/silvestr112233', (206, 40, 350, 53), relative=0)
    pdf.drawString(386, 44, 'LinkedIn')
    pdf.linkURL('https://www.linkedin.com/in/alex-smogankov-683249163/', (386, 40, 432, 53), relative=0)
    pdf.setFillColor(MUTED)
    pdf.drawRightString(WIDTH - 42, 44, f'{page_number:02d} / {total_pages:02d}')


# Размещает настоящий кадр и краткий кейс одной работы.
def draw_project(pdf, project, labels, lang, index, top):
    copy = project[lang]
    image_x, text_x, text_width = 42, 154, WIDTH - 196
    paragraph(pdf, f'{index:02d} / {labels[project["category"]][lang]} / {project["format"]}', text_x, top, text_width, 7.5, MUTED, False, 16)
    title_y = top - 20
    paragraph(pdf, project['title'], text_x, title_y, text_width, 17, INK, True, 28)
    y = paragraph(pdf, copy['variant'], text_x, title_y - 29, text_width, 9.5, ACCENT, True, 29)
    y = paragraph(pdf, copy['summary'], text_x, y - 10, text_width, 9.3, INK, False, 44)
    y = paragraph(pdf, 'Реализация' if lang == 'ru' else 'Implementation', text_x, y - 12, text_width, 8, ACCENT, True, 16)
    bottom = paragraph(pdf, copy['implementation'], text_x, y - 5, text_width, 9, MUTED, False, 54)
    if bottom < top - 186:
        raise ValueError(f'PDF project row overflow: {project["id"]}')
    pdf.drawImage(str(ROOT / project['preview']), image_x, top - 176, width=88, height=167, preserveAspectRatio=True, anchor='c', mask='auto')
    pdf.setStrokeColor(LINE)
    pdf.line(42, top - 190, WIDTH - 42, top - 190)


# Размещает подробный кейс с личным вкладом, решениями и настоящим кадром.
def draw_case_study(pdf, project, labels, lang):
    copy = project[lang]
    width = WIDTH - 84
    heading = 'ПОДРОБНЫЙ КЕЙС' if lang == 'ru' else 'CASE STUDY'
    y = paragraph(pdf, f'{heading} / {labels[project["category"]][lang]} / {project["format"]}', 42, HEIGHT - 124, width, 8, ACCENT, True, 18)
    y = paragraph(pdf, project['title'], 42, y - 16, width, 27, INK, True, 44)
    y = paragraph(pdf, copy['focus'], 42, y - 10, width, 11, ACCENT, True, 38)
    y = paragraph(pdf, copy['summary'], 42, y - 14, width, 10, INK, False, 46)
    top = y - 28
    pdf.drawImage(str(ROOT / project['preview']), 42, top - 234, width=123, height=234, preserveAspectRatio=True, anchor='n', mask='auto')
    sections = [
        ('Мой вклад' if lang == 'ru' else 'My contribution', copy['role']),
        ('Задача' if lang == 'ru' else 'The challenge', copy['challenge']),
        ('Реализация' if lang == 'ru' else 'The implementation', copy['implementation']),
        ('Ключевое решение' if lang == 'ru' else 'The key decision', copy['decisions']),
        ('Попробуйте в демо' if lang == 'ru' else 'Try it in the demo', copy['interaction'])
    ]
    y = top
    for label, text in sections:
        y = paragraph(pdf, label, 190, y, WIDTH - 232, 8.5, ACCENT, True, 18)
        y = paragraph(pdf, text, 190, y - 5, WIDTH - 232, 9.3, INK, False, 100) - 16
    if y < 100:
        raise ValueError(f'PDF case study overflow: {project["id"]}')


# Экспортирует три подробных кейса и полный каталог на выбранном языке.
def export_pdf(projects, labels, clients, lang):
    target = OUTPUT / f'portfolio-{lang}.pdf'
    pdf = canvas.Canvas(str(target), pagesize=A4, pageCompression=1)
    pdf.setTitle(('Портфолио - Алексей Сможанков' if lang == 'ru' else 'Portfolio - Alexey Smozhankov'))
    pdf.setAuthor('Алексей Сможанков / Alexey Smozhankov')
    featured = [project for project in projects if project.get('featured')]
    catalog_pages = math.ceil(len(projects) / 3)
    pages = len(featured) + catalog_pages
    for page_index, project in enumerate(featured):
        draw_page_frame(pdf, lang, page_index + 1, pages, len(projects), clients)
        draw_case_study(pdf, project, labels, lang)
        pdf.showPage()
    for page_index in range(catalog_pages):
        draw_page_frame(pdf, lang, len(featured) + page_index + 1, pages, len(projects), clients)
        for row, project in enumerate(projects[page_index * 3:(page_index + 1) * 3]):
            draw_project(pdf, project, labels, lang, page_index * 3 + row + 1, HEIGHT - 124 - row * 213)
        pdf.showPage()
    pdf.save()
    print(f'{target}: {pages} pages, {len(projects)} projects')


# Готовит две языковые версии из единого каталога сайта.
def main():
    data = load_catalog()
    register_fonts()
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for lang in ['ru', 'en']:
        export_pdf(data['projects'], data['categories'], data['clients'], lang)


if __name__ == '__main__':
    main()
