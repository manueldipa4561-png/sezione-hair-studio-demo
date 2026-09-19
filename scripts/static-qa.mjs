import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pages = ['index.html','servizi.html','lavori.html','prima-volta.html','journal.html','prenota.html'];
const errors = [];

const fail = (file, message) => errors.push(`${file}: ${message}`);
const exists = ref => fs.existsSync(path.join(root, ref.replace(/^\.\//,'')));

for (const file of pages) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  if (!/<html lang="it">/.test(html)) fail(file, 'missing lang=it');
  if (!/name="viewport"/.test(html)) fail(file, 'missing viewport');
  if (!/noindex,nofollow/.test(html)) fail(file, 'missing portfolio noindex');
  if ((html.match(/<h1\b/g) || []).length !== 1) fail(file, 'must contain exactly one h1');
  if (!/class="skip-link"/.test(html)) fail(file, 'missing skip link');
  if (!/styles-v2\.css/.test(html)) fail(file, 'not using v2 CSS');
  if (!/app-v2\.js/.test(html)) fail(file, 'not using v2 JS');
  if (/styles\.css|app\.js/.test(html)) fail(file, 'legacy frontend reference found');

  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="[^"]*"/.test(match[0])) fail(file, 'image without alt attribute');
  }

  for (const match of html.matchAll(/(?:href|src)="\.\/([^"#?]+)(?:\?[^"]*)?"/g)) {
    const ref = match[1];
    if (/^(mailto:|tel:|https?:)/.test(ref)) continue;
    if (!exists(ref)) fail(file, `missing local reference ${ref}`);
  }
}

const cssSize = fs.statSync(path.join(root, 'styles-v2.css')).size;
const jsSize = fs.statSync(path.join(root, 'app-v2.js')).size;
if (cssSize > 120 * 1024) fail('styles-v2.css', 'CSS exceeds 120 KB source budget');
if (jsSize > 40 * 1024) fail('app-v2.js', 'JS exceeds 40 KB source budget');

const app = fs.readFileSync(path.join(root, 'app-v2.js'), 'utf8');
if (/\bfetch\s*\(|XMLHttpRequest|localStorage|sessionStorage/.test(app)) {
  fail('app-v2.js', 'unexpected network or persistent-storage API in concept demo');
}
const booking = fs.readFileSync(path.join(root, 'prenota.html'), 'utf8');
if (/<form\b|type="submit"|name="email"|name="phone"/i.test(booking)) {
  fail('prenota.html', 'booking demo must not contain submission or personal-data fields');
}

if (errors.length) {
  console.error('\nStatic QA failed:\n- ' + errors.join('\n- '));
  process.exit(1);
}
console.log(`Static QA passed for ${pages.length} pages. CSS ${cssSize} B; JS ${jsSize} B.`);
