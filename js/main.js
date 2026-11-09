import { projects, categories, findProject, filterProjects, readRoute, buildProjectUrl } from './projects.mjs';

const ui = {
  grid: document.getElementById('projectsGrid'),
  filters: document.getElementById('portfolioFilters'),
  search: document.getElementById('projectSearch'),
  count: document.getElementById('projectCount'),
  empty: document.getElementById('emptyState'),
  reset: document.getElementById('resetFilters'),
  lang: document.getElementById('langToggle'),
  menu: document.getElementById('menuToggle'),
  nav: document.getElementById('mainNavigation'),
  dialog: document.getElementById('playableModal'),
  layout: document.getElementById('caseLayout'),
  sections: document.getElementById('caseSections'),
  details: document.getElementById('caseDetails'),
  demoColumn: document.getElementById('demoColumn'),
  casePlay: document.getElementById('casePlayButton'),
  close: document.getElementById('playableClose'),
  position: document.getElementById('casePosition'),
  title: document.getElementById('caseTitle'),
  variant: document.getElementById('caseVariant'),
  summary: document.getElementById('caseSummary'),
  challenge: document.getElementById('caseChallenge'),
  implementation: document.getElementById('caseImplementation'),
  interaction: document.getElementById('caseInteraction'),
  tags: document.getElementById('caseTags'),
  permalink: document.getElementById('casePermalink'),
  copy: document.getElementById('copyCaseLink'),
  select: document.getElementById('projectSelect'),
  previous: document.getElementById('previousProject'),
  next: document.getElementById('nextProject'),
  stage: document.getElementById('demoStage'),
  viewport: document.getElementById('demoViewport'),
  cover: document.getElementById('demoCover'),
  image: document.getElementById('demoCoverImage'),
  loading: document.getElementById('demoLoading'),
  status: document.getElementById('demoStatus'),
  restart: document.getElementById('demoRestart'),
  rotate: document.getElementById('demoRotate'),
  expand: document.getElementById('demoExpand'),
  stop: document.getElementById('demoStop'),
  showreelToggle: document.getElementById('showreelToggle')
};
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const videos = [...document.querySelectorAll('.showreel-video')];
let savedLang = 'ru';
try { savedLang = localStorage.getItem('lang') || 'ru'; } catch { /* Язык остаётся доступен без хранилища. */ }
const initialRoute = readRoute(new URL(window.location.href), savedLang);
const state = {
  lang: initialRoute.lang,
  category: 'all',
  query: '',
  selected: null,
  frame: null,
  opener: null,
  landscape: false,
  expanded: false,
  demoState: 'ready',
  loadTimer: null,
  copyTimer: null,
  showreelPaused: motionPreference.matches,
  heroVisible: true
};

// Возвращает строку интерфейса на текущем языке.
function t(ru, en) {
  return state.lang === 'ru' ? ru : en;
}

// Экранирует текст каталога перед вставкой в HTML-разметку.
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

// Собирает постоянное название работы вместе с вариантом сценария.
function projectName(project) {
  return project.title + ' — ' + project[state.lang].variant;
}

// Создаёт карточку с настоящим кадром и отдельными переходами к демо и кейсу.
function cardMarkup(project) {
  const copy = project[state.lang];
  const href = escapeHtml(buildProjectUrl(new URL(window.location.href), project.id, state.lang));
  const preview = escapeHtml(new URL(project.preview, window.location.href).href);
  const name = escapeHtml(projectName(project));
  const number = String(projects.indexOf(project) + 1).padStart(2, '0');
  return '<article class="project-card" data-project="' + project.id + '">' +
    '<a class="project-art" href="' + href + '" data-open-project="' + project.id + '" data-autoplay="true" style="--preview:url(' + preview + ')" aria-label="' + t('Играть: ', 'Play: ') + name + '">' +
    '<img src="' + project.preview + '" width="390" height="740" loading="lazy" decoding="async" alt="' + name + '"><span class="art-open" aria-hidden="true">▶</span></a>' +
    '<div class="project-body"><div class="project-meta"><span>' + number + ' / ' + categories[project.category][state.lang] + '</span><span>' + project.format + '</span></div>' +
    '<h3><a href="' + href + '" data-open-project="' + project.id + '">' + escapeHtml(project.title) + '</a></h3>' +
    '<p class="project-variant">' + escapeHtml(copy.variant) + '</p><p class="project-summary">' + escapeHtml(copy.summary) + '</p>' +
    '<div class="project-actions"><a class="play-link" href="' + href + '" data-open-project="' + project.id + '" data-autoplay="true" aria-label="' + t('Играть: ', 'Play: ') + name + '"><span aria-hidden="true">▶</span>' + t('Играть', 'Play') + '</a>' +
    '<a class="case-link" href="' + href + '" data-open-project="' + project.id + '" aria-label="' + t('О проекте: ', 'About: ') + name + '">' + t('О проекте', 'View case') + '<span aria-hidden="true">↗</span></a></div></div></article>';
}

// Показывает результат поиска и честное количество доступных работ.
function renderGallery() {
  const visible = filterProjects({ category: state.category, query: state.query });
  ui.grid.innerHTML = visible.map(cardMarkup).join('');
  ui.count.textContent = t('Показано: ', 'Showing: ') + visible.length + ' / ' + projects.length;
  ui.empty.hidden = visible.length !== 0;
}

// Создаёт жанровые фильтры с количеством реальных проектов.
function renderFilters() {
  ui.filters.innerHTML = Object.entries(categories).map(([id, label]) => {
    const count = id === 'all' ? projects.length : projects.filter(project => project.category === id).length;
    return '<button class="filter-btn" type="button" data-filter="' + id + '" aria-pressed="' + (state.category === id) + '">' + label[state.lang] + '<span>' + count + '</span></button>';
  }).join('');
}

// Заполняет список всех работ, включая отдельные версии одной игры.
function renderProjectSelector() {
  ui.select.innerHTML = projects.map((project, index) => '<option value="' + project.id + '">' + String(index + 1).padStart(2, '0') + ' / ' + escapeHtml(projectName(project)) + '</option>').join('');
  if (state.selected) ui.select.value = state.selected.id;
}

// Обновляет доступный статус загрузки и работы игрового плеера.
function renderDemoStatus() {
  const messages = {
    ready: t('Нажмите Play. Звук — после запуска.', 'Press Play. Sound starts with the demo.'),
    loading: t('Загружаем игру…', 'Loading the game…'),
    playing: t('Игра запущена. Можно играть прямо здесь.', 'Demo running. Play right here.'),
    error: t('Не удалось загрузить игру. Нажмите «Заново».', 'The demo did not load. Press Restart.')
  };
  ui.status.textContent = messages[state.demoState];
}

// Синхронизирует текст, обложку и постоянную ссылку выбранного кейса.
function renderCase() {
  if (!state.selected) return;
  const project = state.selected;
  const copy = project[state.lang];
  ui.title.textContent = project.title;
  ui.variant.textContent = copy.variant;
  ui.summary.textContent = copy.summary;
  ui.challenge.textContent = copy.challenge;
  ui.implementation.textContent = copy.implementation;
  ui.interaction.textContent = copy.interaction;
  ui.position.textContent = String(projects.indexOf(project) + 1).padStart(2, '0') + ' / ' + projects.length;
  ui.tags.innerHTML = '<span>' + categories[project.category][state.lang] + '</span><span>' + project.format + '</span><span>PLAYABLE AD</span>';
  ui.image.src = project.preview;
  ui.image.alt = projectName(project);
  ui.cover.setAttribute('aria-label', t('Запустить ', 'Play ') + projectName(project));
  ui.permalink.href = buildProjectUrl(new URL(window.location.href), project.id, state.lang);
  ui.select.value = project.id;
  if (state.frame) state.frame.title = projectName(project) + ' — playable demo';
  renderDemoStatus();
}

// Переключает язык страницы, каталога, кейса и скачиваемого PDF.
function applyLanguage(lang, updateUrl = false) {
  state.lang = lang === 'en' ? 'en' : 'ru';
  document.documentElement.lang = state.lang;
  document.title = t('Алексей Сможанков — Playable Ads Developer', 'Alexey Smozhankov — Playable Ads Developer');
  document.querySelector('meta[name="description"]').content = t('Алексей Сможанков — разработчик playable ads. 21 интерактивная работа: игровые механики, 2D и 3D, демо и кейсы.', 'Alexey Smozhankov — Playable Ads Developer. 21 interactive projects: game mechanics, 2D and 3D, live demos and cases.');
  document.querySelectorAll('[data-ru]').forEach(element => { element.textContent = element.dataset[state.lang]; });
  document.querySelectorAll('[data-label-ru]').forEach(element => { element.setAttribute('aria-label', state.lang === 'ru' ? element.dataset.labelRu : element.dataset.labelEn); });
  document.querySelectorAll('[data-placeholder-ru]').forEach(element => { element.placeholder = state.lang === 'ru' ? element.dataset.placeholderRu : element.dataset.placeholderEn; });
  document.querySelectorAll('[data-pdf-link]').forEach(link => { link.href = 'assets/portfolio/portfolio-' + state.lang + '.pdf'; });
  ui.lang.textContent = state.lang === 'ru' ? 'EN' : 'RU';
  ui.lang.setAttribute('aria-label', t('Switch to English', 'Переключить на русский'));
  try { localStorage.setItem('lang', state.lang); } catch { /* Переключение не зависит от localStorage. */ }
  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', state.lang);
    history.replaceState(history.state, '', url.pathname + url.search + url.hash);
  }
  renderFilters();
  renderGallery();
  renderProjectSelector();
  renderCase();
  updateShowreelToggle();
  updateMenuLabel();
}

// Открывает выбранный кейс; игровой iframe создаётся только по явному запуску.
function selectProject(id, { autoplay = false, updateHistory = true } = {}) {
  const project = findProject(id);
  if (!project) return;
  const wasOpen = ui.dialog.open;
  if (!wasOpen) {
    state.opener = document.activeElement;
    state.expanded = false;
    ui.dialog.classList.remove('is-expanded');
    ui.expand.setAttribute('aria-pressed', 'false');
  }
  stopDemo();
  state.selected = project;
  state.landscape = false;
  ui.rotate.setAttribute('aria-pressed', 'false');
  renderCase();
  if (!wasOpen) {
    ui.dialog.showModal();
    ui.close.focus({ preventScroll: true });
  }
  if (updateHistory) {
    const href = buildProjectUrl(new URL(window.location.href), project.id, state.lang);
    if (wasOpen) history.replaceState(history.state, '', href);
    else history.pushState({ portfolioCase: true }, '', href);
  }
  fitDemo();
  syncShowreelPlayback();
  if (autoplay) startDemo();
  if (window.matchMedia('(max-width: 640px)').matches) showCaseSection(autoplay ? 'demo' : 'details', false);
  else ui.layout.scrollTop = 0;
}

// Показывает нужную часть мобильного кейса без изменения адреса и истории.
function showCaseSection(section, smooth = true) {
  const target = section === 'details' ? ui.details : ui.demoColumn;
  const top = ui.layout.scrollTop + target.getBoundingClientRect().top - ui.layout.getBoundingClientRect().top;
  if (smooth && !motionPreference.matches) ui.layout.scrollTo({ top, behavior: 'smooth' });
  else ui.layout.scrollTop = top;
}

// Переключает видимую часть кейса кнопками «Демо» и «О проекте».
function handleCaseSectionClick(event) {
  const button = event.target.closest('button[data-case-section]');
  if (button) showCaseSection(button.dataset.caseSection);
}

// Открывает игру из описания, сохраняя уже начатую сессию.
function playCaseDemo() {
  if (!state.frame || state.demoState === 'error') startDemo();
  showCaseSection('demo');
  state.frame?.focus({ preventScroll: true });
}

// Закрывает кейс, выгружает игру и возвращает фокус на исходную карточку.
function closeCase({ updateUrl = true } = {}) {
  if (!ui.dialog.open) return;
  stopDemo();
  ui.dialog.close();
  state.opener?.focus({ preventScroll: true });
  syncShowreelPlayback();
  if (updateUrl) {
    if (history.state?.portfolioCase) history.back();
    else {
      const url = new URL(window.location.href);
      url.searchParams.delete('project');
      url.hash = 'portfolio';
      history.replaceState(null, '', url.pathname + url.search + url.hash);
    }
  }
}

// Запускает один выбранный playable и отслеживает готовность его документа.
function startDemo() {
  if (!state.selected) return;
  stopDemo();
  const frame = document.createElement('iframe');
  frame.title = projectName(state.selected) + ' — playable demo';
  frame.allow = 'autoplay; fullscreen; gyroscope; accelerometer';
  frame.addEventListener('load', handleFrameLoad);
  frame.addEventListener('error', handleFrameError);
  frame.src = state.selected.src;
  state.frame = frame;
  state.demoState = 'loading';
  ui.cover.hidden = true;
  ui.loading.hidden = false;
  ui.restart.disabled = false;
  ui.stop.disabled = false;
  ui.viewport.append(frame);
  state.loadTimer = window.setTimeout(handleFrameTimeout, 25000);
  renderDemoStatus();
}

// Полностью выгружает iframe, чтобы остановить игровой звук и выполнение.
function stopDemo() {
  window.clearTimeout(state.loadTimer);
  state.loadTimer = null;
  if (state.frame) {
    state.frame.removeEventListener('load', handleFrameLoad);
    state.frame.removeEventListener('error', handleFrameError);
    try { state.frame.contentWindow.removeEventListener('keydown', handleFrameKeydown); } catch { /* Фрейм может быть уже выгружен. */ }
    state.frame.src = 'about:blank';
    state.frame.remove();
    state.frame = null;
  }
  state.demoState = 'ready';
  ui.cover.hidden = false;
  ui.loading.hidden = true;
  ui.restart.disabled = true;
  ui.stop.disabled = true;
  renderDemoStatus();
}

// Подключает закрытие по Escape внутри игры и сообщает ей размер области.
function handleFrameLoad(event) {
  if (event.currentTarget !== state.frame) return;
  window.clearTimeout(state.loadTimer);
  ui.loading.hidden = true;
  state.demoState = 'playing';
  try { state.frame.contentWindow.addEventListener('keydown', handleFrameKeydown); } catch { /* Основной диалог сохраняет штатное закрытие. */ }
  notifyFrameResize();
  renderDemoStatus();
}

// Оставляет пользователю доступный перезапуск при ошибке загрузки.
function handleFrameError() {
  window.clearTimeout(state.loadTimer);
  ui.loading.hidden = true;
  state.demoState = 'error';
  renderDemoStatus();
}

// Снимает бесконечное состояние загрузки, если iframe не ответил вовремя.
function handleFrameTimeout() {
  if (state.demoState === 'loading') handleFrameError();
}

// Закрывает весь кейс по Escape, даже когда фокус находится в игре.
function handleFrameKeydown(event) {
  if (event.key !== 'Escape') return;
  event.preventDefault();
  event.stopPropagation();
  closeCase();
}

// Вписывает портретную или альбомную игровую область без обрезания.
function fitDemo() {
  if (!ui.dialog.open) return;
  const ratio = state.landscape ? 16 / 9 : 9 / 16;
  const width = Math.floor(Math.min(ui.stage.clientWidth, ui.stage.clientHeight * ratio));
  ui.viewport.style.width = width + 'px';
  ui.viewport.style.height = Math.floor(width / ratio) + 'px';
  notifyFrameResize();
}

// Передаёт размер встроенной игре через её существующий обработчик resize.
function notifyFrameResize() {
  if (!state.frame) return;
  try {
    const frameWindow = state.frame.contentWindow;
    frameWindow.postMessage({ type: 'resize', width: state.frame.clientWidth, height: state.frame.clientHeight }, window.location.origin);
    frameWindow.dispatchEvent(new frameWindow.Event('resize'));
  } catch { /* Фрейм получит нативное изменение viewport после загрузки. */ }
}

// Переключает ориентацию текущей игры без её перезагрузки.
function rotateDemo() {
  state.landscape = !state.landscape;
  ui.rotate.setAttribute('aria-pressed', String(state.landscape));
  fitDemo();
}

// Разворачивает окно кейса на всю область браузера.
function expandDemo() {
  state.expanded = !state.expanded;
  ui.dialog.classList.toggle('is-expanded', state.expanded);
  ui.expand.setAttribute('aria-pressed', String(state.expanded));
  fitDemo();
}

// Переходит к соседней работе и сохраняет режим просмотра или игры.
function moveProject(direction) {
  if (!state.selected) return;
  const index = (projects.indexOf(state.selected) + direction + projects.length) % projects.length;
  selectProject(projects[index].id, { autoplay: Boolean(state.frame) });
}

// Копирует прямую ссылку и показывает результат без изменения описания кейса.
async function copyCaseLink() {
  if (!state.selected) return;
  window.clearTimeout(state.copyTimer);
  const href = new URL(buildProjectUrl(new URL(window.location.href), state.selected.id, state.lang), window.location.origin).href;
  try {
    await navigator.clipboard.writeText(href);
    ui.copy.textContent = t('Ссылка скопирована', 'Link copied');
  } catch {
    ui.permalink.focus();
    ui.copy.textContent = t('Ссылка — под описанием', 'Link below the description');
  }
  state.copyTimer = window.setTimeout(resetCopyLabel, 2500);
}

// Восстанавливает подпись кнопки после копирования ссылки.
function resetCopyLabel() {
  ui.copy.textContent = t('Скопировать ссылку', 'Copy case link');
}

// Обрабатывает открытие кейса из карточки или существующего шоурила.
function handleProjectClick(event) {
  const link = event.target.closest('a[data-open-project]');
  if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  selectProject(link.dataset.openProject, { autoplay: link.dataset.autoplay === 'true' });
}

// Применяет жанр, сохраняя фокус на нажатой кнопке фильтра.
function handleFilterClick(event) {
  const button = event.target.closest('button[data-filter]');
  if (!button || !categories[button.dataset.filter]) return;
  state.category = button.dataset.filter;
  ui.filters.querySelectorAll('button').forEach(item => { item.setAttribute('aria-pressed', String(item === button)); });
  renderGallery();
}

// Сохраняет поисковую строку и обновляет только галерею.
function handleSearch() {
  state.query = ui.search.value;
  renderGallery();
}

// Возвращает все работы после пустого результата или выбранного жанра.
function resetFilters() {
  state.category = 'all';
  state.query = '';
  ui.search.value = '';
  renderFilters();
  renderGallery();
  ui.search.focus();
}

// Синхронизирует кейс и язык с кнопками браузера «Назад» и «Вперёд».
function handleRoute() {
  const route = readRoute(new URL(window.location.href), state.lang);
  if (route.lang !== state.lang) applyLanguage(route.lang);
  if (route.project) selectProject(route.project.id, { updateHistory: false });
  else closeCase({ updateUrl: false });
}

// Согласует штатное закрытие диалога с выгрузкой игрового фрейма.
function handleCaseCancel(event) {
  event.preventDefault();
  closeCase();
}

// Закрывает окно только при нажатии на фон за его границами.
function handleBackdropClick(event) {
  if (event.target !== ui.dialog) return;
  const bounds = ui.dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeCase();
}

// Обновляет доступную подпись кнопки мобильного меню.
function updateMenuLabel() {
  const isOpen = ui.nav.classList.contains('open');
  ui.menu.setAttribute('aria-expanded', String(isOpen));
  ui.menu.setAttribute('aria-label', isOpen ? t('Закрыть меню', 'Close menu') : t('Открыть меню', 'Open menu'));
}

// Переключает мобильную навигацию.
function toggleMenu() {
  ui.nav.classList.toggle('open');
  updateMenuLabel();
}

// Закрывает мобильное меню после перехода к разделу.
function closeMenu(event) {
  if (event && !event.target.closest('a')) return;
  ui.nav.classList.remove('open');
  updateMenuLabel();
}

// Закрывает мобильное меню по Escape и возвращает фокус на его кнопку.
function handleDocumentKeydown(event) {
  if (event.key === 'Escape' && !ui.dialog.open && ui.nav.classList.contains('open')) {
    closeMenu();
    ui.menu.focus();
  }
}

// Обновляет доступный элемент управления существующими видеопревью.
function updateShowreelToggle() {
  ui.showreelToggle.querySelector('.showreel-toggle-icon').textContent = state.showreelPaused ? '▶' : 'Ⅱ';
  ui.showreelToggle.querySelector('.showreel-toggle-text').textContent = state.showreelPaused ? t('Воспроизвести', 'Play') : t('Пауза', 'Pause');
  ui.showreelToggle.setAttribute('aria-label', state.showreelPaused ? t('Воспроизвести шоурил', 'Play showreel') : t('Приостановить шоурил', 'Pause showreel'));
}

// Сохраняет ручной запуск, если браузер запрещает автоматическое видео.
function handleShowreelError(error) {
  if (error.name === 'NotAllowedError' || error.name === 'NotSupportedError') {
    state.showreelPaused = true;
    updateShowreelToggle();
  }
}

// Проигрывает шоурил только на видимом первом экране без открытой игры.
function syncShowreelPlayback() {
  const shouldPlay = !state.showreelPaused && state.heroVisible && !document.hidden && !ui.dialog.open;
  videos.forEach(video => {
    if (shouldPlay) video.play().catch(handleShowreelError);
    else video.pause();
  });
  updateShowreelToggle();
}

// Сохраняет выбор паузы при открытии и закрытии кейсов.
function toggleShowreel() {
  state.showreelPaused = !state.showreelPaused;
  syncShowreelPlayback();
}

// Останавливает видео после ухода первого экрана из области просмотра.
function handleHeroVisibility(entries) {
  state.heroVisible = entries[0].isIntersecting;
  syncShowreelPlayback();
}

// Учитывает изменение системного предпочтения уменьшенного движения.
function handleMotionPreference(event) {
  state.showreelPaused = event.matches;
  syncShowreelPlayback();
}

// Связывает явные действия пользователя с нужной операцией каталога.
document.addEventListener('click', handleProjectClick);
document.addEventListener('keydown', handleDocumentKeydown);
ui.filters.addEventListener('click', handleFilterClick);
ui.search.addEventListener('input', handleSearch);
ui.reset.addEventListener('click', resetFilters);
ui.lang.addEventListener('click', () => applyLanguage(state.lang === 'ru' ? 'en' : 'ru', true));
ui.menu.addEventListener('click', toggleMenu);
ui.nav.addEventListener('click', closeMenu);
ui.close.addEventListener('click', () => closeCase());
ui.dialog.addEventListener('cancel', handleCaseCancel);
ui.dialog.addEventListener('click', handleBackdropClick);
ui.sections.addEventListener('click', handleCaseSectionClick);
ui.casePlay.addEventListener('click', playCaseDemo);
ui.cover.addEventListener('click', startDemo);
ui.restart.addEventListener('click', startDemo);
ui.stop.addEventListener('click', stopDemo);
ui.rotate.addEventListener('click', rotateDemo);
ui.expand.addEventListener('click', expandDemo);
ui.copy.addEventListener('click', copyCaseLink);
ui.previous.addEventListener('click', () => moveProject(-1));
ui.next.addEventListener('click', () => moveProject(1));
ui.select.addEventListener('change', () => selectProject(ui.select.value, { autoplay: Boolean(state.frame) }));
ui.showreelToggle.addEventListener('click', toggleShowreel);
window.addEventListener('popstate', handleRoute);
document.addEventListener('visibilitychange', syncShowreelPlayback);
motionPreference.addEventListener('change', handleMotionPreference);

const demoObserver = new ResizeObserver(fitDemo);
demoObserver.observe(ui.stage);
const heroObserver = new IntersectionObserver(handleHeroVisibility, { threshold: 0.1 });
heroObserver.observe(document.getElementById('hero'));
applyLanguage(state.lang);
if (initialRoute.project) selectProject(initialRoute.project.id, { updateHistory: false });
syncShowreelPlayback();
