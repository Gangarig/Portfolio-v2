import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);

test('local assets and section links exist with exact case', () => {
  assert.equal(new Set(ids).size, ids.length, 'Duplicate HTML IDs');
  for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (url.startsWith('#')) {
      assert.ok(ids.includes(url.slice(1)), `Missing anchor ${url}`);
    } else if (url.startsWith('./')) {
      const asset = resolve(root, url);
      assert.ok(existsSync(asset), `Missing asset ${url}`);
      assert.ok(readdirSync(dirname(asset)).includes(url.split('/').at(-1)), `Asset case mismatch ${url}`);
    }
  }
  assert.equal(readFileSync(resolve(root, 'assets/resume.pdf')).subarray(0, 5).toString(), '%PDF-');
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
});

test('outbound new-tab links have safe rel attributes', () => {
  for (const [tag] of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    assert.match(tag, /rel="[^"]*noopener/);
    assert.match(tag, /rel="[^"]*noreferrer/);
  }
});

function makeContext(storageBlocked = false) {
  const elements = Object.fromEntries(['theme-toggle', 'year', 'copy-email', 'copy-toast'].map(id => [id, {
    hidden: true, textContent: '', attributes: {}, events: {},
    setAttribute(name, value) { this.attributes[name] = value; },
    addEventListener(name, callback) { this.events[name] = callback; },
  }]));
  const document = { documentElement: { dataset: { theme: 'light' } }, getElementById: id => elements[id] };
  const storage = { theme: 'dark' };
  const localStorage = {
    getItem(key) { if (storageBlocked) throw Error('Blocked'); return storage[key]; },
    setItem(key, value) { if (storageBlocked) throw Error('Blocked'); storage[key] = value; },
  };
  const clipboard = { value: '', async writeText(value) { this.value = value; } };
  const context = { document, localStorage, navigator: { clipboard }, window: { isSecureContext: true }, setTimeout: () => 1, clearTimeout: () => {} };
  runInNewContext(readFileSync(resolve(root, 'js/theme.js'), 'utf8'), context);
  runInNewContext(readFileSync(resolve(root, 'js/site.js'), 'utf8'), context);
  return { document, elements, storage, clipboard };
}

test('saved theme, toggle, accessible label and year work', () => {
  const { document, elements, storage } = makeContext();
  assert.equal(document.documentElement.dataset.theme, 'dark');
  assert.equal(elements['theme-toggle'].attributes['aria-label'], 'Switch to light theme');
  elements['theme-toggle'].events.click();
  assert.equal(document.documentElement.dataset.theme, 'light');
  assert.equal(storage.theme, 'light');
  assert.equal(elements['theme-toggle'].attributes['aria-label'], 'Switch to dark theme');
  assert.equal(elements.year.textContent, new Date().getFullYear());
});

test('theme remains usable with blocked browser storage', () => {
  const { document, elements } = makeContext(true);
  elements['theme-toggle'].events.click();
  assert.equal(document.documentElement.dataset.theme, 'dark');
});

test('copy email reports success and handles denied permission', async () => {
  const { elements, clipboard } = makeContext();
  await elements['copy-email'].events.click();
  assert.equal(clipboard.value, 'gangarign@gmail.com');
  assert.equal(elements['copy-toast'].textContent, 'Email address copied.');
  clipboard.writeText = async () => { throw Error('Denied'); };
  await elements['copy-email'].events.click();
  assert.match(elements['copy-toast'].textContent, /Couldn't copy/);
});
