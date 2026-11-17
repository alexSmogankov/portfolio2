import { analyticsConfig } from './analytics-config.mjs';

let enabled = false;
let ready = false;
let pending = [];
let pageUrl = '';
let referrer = '';

// Оставляет в адресе только путь и ограниченные метки рекламного источника.
export function cleanAnalyticsUrl(value) {
  const url = new URL(value);
  const query = new URLSearchParams();
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign']) {
    const label = url.searchParams.get(key);
    if (label && /^[a-zA-Z0-9_-]{1,80}$/.test(label)) query.set(key, label);
  }
  return url.pathname + (query.size ? '?' + query : '');
}

// Отправляет событие с очищенным адресом, не влияя на работу портфолио при сбое.
function send(name, data) {
  try {
    Promise.resolve(window.umami.track(props => ({
      website: props.website,
      hostname: props.hostname,
      screen: props.screen,
      language: props.language,
      title: 'Playable ads portfolio',
      url: pageUrl,
      referrer,
      ...(name ? { name, data } : {})
    }))).catch(() => {});
  } catch { /* Заблокированный счётчик не мешает просмотру и запуску игр. */ }
}

// Сохраняет ограниченную очередь действий, совершённых до загрузки счётчика.
export function trackPortfolioEvent(name, data = {}) {
  if (!enabled) return;
  if (ready) send(name, data);
  else if (pending.length < 30) pending.push({ name, data });
}

// После загрузки считает один просмотр страницы и накопленные действия без дублей навигации.
function handleTrackerLoad() {
  if (typeof window.umami?.track !== 'function') return handleTrackerFailure();
  ready = true;
  send();
  for (const event of pending) send(event.name, event.data);
  pending = [];
}

// Освобождает очередь, если расширение или сеть заблокировали аналитику.
function handleTrackerFailure() {
  enabled = false;
  pending = [];
}

// Считает скачивания и обращения по каналу, не отправляя адреса контактов.
function handleAnalyticsClick(event) {
  const link = event.target.closest('a');
  if (!link) return;
  if (link.matches('[data-pdf-link]')) {
    trackPortfolioEvent('pdf_download_click', { language: document.documentElement.lang });
    return;
  }
  const url = new URL(link.href);
  const channel = url.protocol === 'mailto:' ? 'email' :
    url.hostname === 't.me' ? 'telegram' :
    url.hostname === 'www.linkedin.com' ? 'linkedin' : null;
  if (channel) trackPortfolioEvent('contact_click', { channel });
}

// Подключает счётчик только на явно разрешённом опубликованном домене.
export function startAnalytics() {
  const { websiteId, scriptUrl, domains } = analyticsConfig;
  if (enabled || !/^[0-9a-f-]{36}$/i.test(websiteId) ||
      location.protocol !== 'https:' || !domains.includes(location.hostname) ||
      ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) ||
      navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true) return;
  pageUrl = cleanAnalyticsUrl(location.href);
  try { referrer = document.referrer ? new URL(document.referrer).origin : ''; }
  catch { referrer = ''; }
  enabled = true;
  const script = document.createElement('script');
  script.src = scriptUrl;
  script.async = true;
  script.dataset.websiteId = websiteId;
  script.dataset.autoTrack = 'false';
  script.referrerPolicy = 'origin';
  script.addEventListener('load', handleTrackerLoad, { once: true });
  script.addEventListener('error', handleTrackerFailure, { once: true });
  document.head.append(script);
  document.addEventListener('click', handleAnalyticsClick);
}
