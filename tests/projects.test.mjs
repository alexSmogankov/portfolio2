import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { projects, findProject, filterProjects, readRoute, buildProjectUrl, pickShowreelProjects } from '../js/projects.mjs';

// Проверяет, что ни одна предоставленная работа не потеряна в каталоге.
test('every supplied playable is represented once and links to its real file', () => {
  const assets = new URL('../assets/', import.meta.url);
  const folders = readdirSync(assets, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && existsSync(new URL(`${encodeURIComponent(entry.name)}/index.html`, assets)))
    .map(entry => entry.name).sort();
  assert.ok(folders.length > 0);
  assert.deepEqual(projects.map(project => project.folder).sort(), folders);
  assert.equal(new Set(projects.map(project => project.id)).size, projects.length);
  for (const project of projects) {
    assert.ok(existsSync(fileURLToPath(new URL(`../${project.src}`, import.meta.url))));
    assert.ok(existsSync(fileURLToPath(new URL(`../${project.preview}`, import.meta.url))), `Missing preview: ${project.id}`);
    assert.ok(project.ru.summary && project.en.summary);
  }
});

// Проверяет совместную работу жанра и поиска на реальных данных.
test('search ignores case and whitespace and intersects the selected category', () => {
  const variants = filterProjects({ query: '  RAILROAD  ' });
  assert.equal(variants.length, 5);
  assert.ok(variants.every(project => project.title === 'Railroad Empire'));
  assert.equal(filterProjects({ category: 'puzzle', query: 'Railroad' }).length, 0);
  assert.equal(filterProjects({ query: 'no-such-project-934' }).length, 0);
  assert.equal(filterProjects().length, projects.length);
});

// Проверяет безопасную обработку неизвестных проектов и языка.
test('unknown project URLs never become iframe sources', () => {
  assert.equal(findProject('../../secrets'), null);
  const route = readRoute(new URL('https://example.com/portfolio/?project=https://evil.example&lang=bad'), 'en');
  assert.equal(route.project, null);
  assert.equal(route.lang, 'en');
  assert.equal(readRoute(new URL('https://example.com/'), 'bad').lang, 'ru');
});

// Проверяет прямые ссылки при размещении сайта в подпапке GitHub Pages.
test('case links round trip without losing the deployment path or other parameters', () => {
  const id = projects.find(project => project.folder === 'MERGE MAYOR')?.id;
  assert.ok(id);
  const relative = buildProjectUrl(new URL('https://example.com/my-portfolio/?utm_source=review#portfolio'), id, 'en');
  const url = new URL(relative, 'https://example.com');
  assert.equal(url.pathname, '/my-portfolio/');
  assert.equal(url.searchParams.get('utm_source'), 'review');
  assert.equal(url.hash, '#case');
  const route = readRoute(url);
  assert.equal(route.project.id, id);
  assert.equal(route.lang, 'en');
});

// Проверяет разнообразие ленты и сохранение исходного порядка каталога.
test('showreel samples five different games without changing the catalogue', () => {
  const order = projects.map(project => project.id);
  const selected = pickShowreelProjects([], () => 0.4);
  assert.equal(selected.length, 5);
  assert.equal(new Set(selected.map(project => project.title)).size, 5);
  assert.ok(selected.every(project => projects.includes(project)));
  assert.deepEqual(projects.map(project => project.id), order);
});

// Проверяет смену игр после обновления страницы, включая варианты одного проекта.
test('showreel excludes games from the previous visit and accepts unknown saved IDs', () => {
  const previous = ['railroad-020', 'my-aquapark', 'pixel-gun', 'merge-mayor', 'kingdom-clash', 'unknown-id'];
  const previousTitles = new Set(previous.map(id => findProject(id)?.title));
  const selected = pickShowreelProjects(previous, () => 0.6);
  assert.equal(selected.length, 5);
  assert.ok(selected.every(project => !previousTitles.has(project.title)));
});

// Проверяет, что случайное число влияет на состав ленты, а не только на порядок.
test('showreel randomness changes the selected games', () => {
  const first = pickShowreelProjects([], () => 0).map(project => project.title).sort();
  const second = pickShowreelProjects([], () => 0.999).map(project => project.title).sort();
  assert.notDeepEqual(first, second);
});

// Проверяет наличие ролика для любой работы, которая может попасть в случайную ленту.
test('showreel has a real video for every selectable project', () => {
  for (const project of projects) {
    assert.ok(project.video, `Missing video source: ${project.id}`);
    assert.ok(existsSync(fileURLToPath(new URL(`../${project.video}`, import.meta.url))), `Missing video file: ${project.id}`);
  }
});
