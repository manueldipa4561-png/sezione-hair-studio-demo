import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve('.lighthouseci');
const files = fs.readdirSync(dir)
  .filter(name => /^lhr-.*\.json$/i.test(name))
  .sort();

if (!files.length) {
  console.log('No Lighthouse result JSON files found.');
  process.exit(0);
}

const rows = files.map(file => {
  const report = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
  const categories = report.categories || {};
  const audits = report.audits || {};
  const pct = key => Math.round((categories[key]?.score ?? 0) * 100);
  const ms = key => Math.round(audits[key]?.numericValue ?? 0);
  const num = key => Number((audits[key]?.numericValue ?? 0).toFixed(3));
  return {
    url: report.finalUrl || report.requestedUrl || file,
    performance: pct('performance'),
    accessibility: pct('accessibility'),
    bestPractices: pct('best-practices'),
    lcpMs: ms('largest-contentful-paint'),
    cls: num('cumulative-layout-shift')
  };
});

console.log('\nLighthouse summary');
console.log('URL | Performance | Accessibility | Best Practices | LCP ms | CLS');
for (const row of rows) {
  console.log(`${row.url} | ${row.performance} | ${row.accessibility} | ${row.bestPractices} | ${row.lcpMs} | ${row.cls}`);
}
