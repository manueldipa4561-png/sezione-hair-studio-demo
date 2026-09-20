import fs from 'node:fs';

const html = fs.readFileSync('index.html','utf8');
const css = fs.readFileSync('styles.css','utf8');
const errors = [];
const fail = msg => errors.push(msg);

if (!/<html lang="it">/.test(html)) fail('missing lang=it');
if (!/name="viewport"/.test(html)) fail('missing viewport');
if (!/noindex,nofollow/.test(html)) fail('missing noindex,nofollow');
if ((html.match(/<h1\b/g) || []).length !== 1) fail('must contain exactly one h1');
if (!/class="skip-link"/.test(html)) fail('missing skip link');
if (!/styles\.css/.test(html)) fail('active Home must use styles.css');
if (/styles-v2\.css|app-v2\.js/.test(html)) fail('legacy frontend linked from active Home');
if (!/George Northwood/.test(fs.readFileSync('docs/HOME-HERO-REFERENCE-CARD.md','utf8'))) fail('missing real-world reference card');
if (!/Rossano Ferretti/.test(fs.readFileSync('docs/HOME-PIECE-02-REFERENCE-CARD.md','utf8'))) fail('missing Piece 02 reference card');
if (!/Hershesons/.test(fs.readFileSync('docs/HOME-PIECE-03-REFERENCE-CARD.md','utf8'))) fail('missing Piece 03 reference card');
if (!/Homepage-Mobile-Banner_1200x\.jpg/.test(html)) fail('hero reference image missing');
if ((html.match(/<section\b/g) || []).length !== 2) fail('Home must contain exactly the two current pieces');
if (!/class="hero"/.test(html)) fail('hero missing');
if (!/class="home-statement"/.test(html)) fail('piece 02 statement missing');
if (!/class="home-space"/.test(html)) fail('piece 03 space block missing');
if (!/OPTIMIZE_BACKUP_PRODUCT_HERSH_JA_9882-1-1500x932\.jpg/.test(html)) fail('Piece 03 real reference image missing');
if (!/class="site-header"/.test(html)) fail('header missing');
if (css.length > 48 * 1024) fail('active CSS exceeds 48 KB source budget');

for (const img of html.matchAll(/<img\b[^>]*>/g)) {
  if (!/\balt="[^"]*"/.test(img[0])) fail('image without alt attribute');
}

if (errors.length) {
  console.error('Static QA failed:\n- ' + errors.join('\n- '));
  process.exit(1);
}

console.log('Static QA PASS — reference-led Home Pieces 01–03.');
