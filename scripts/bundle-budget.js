import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const DIST_ASSETS = path.resolve('dist/assets');
const MAX_INITIAL_JS_GZIP = 180 * 1024; // 180 KB in bytes

function checkBudget() {
  if (!fs.existsSync(DIST_ASSETS)) {
    console.error(`Assets directory does not exist: ${DIST_ASSETS}. Run build first.`);
    process.exit(1);
  }

  const files = fs.readdirSync(DIST_ASSETS).filter(f => f.endsWith('.js'));
  let indexFileGzipSize = 0;
  let hasFailure = false;

  console.log('\n--- BUNDLE BUDGET AUDIT ---');
  for (const file of files) {
    const filePath = path.join(DIST_ASSETS, file);
    const content = fs.readFileSync(filePath);
    const gzipped = zlib.gzipSync(content);
    const rawKb = (content.length / 1024).toFixed(2);
    const gzipKb = (gzipped.length / 1024).toFixed(2);

    console.log(`- ${file}: ${rawKb} KB raw (${gzipKb} KB gzip)`);

    // Identify primary entry chunk
    if (file.startsWith('index-') || file === 'index.js') {
      indexFileGzipSize = gzipped.length;
      if (indexFileGzipSize > MAX_INITIAL_JS_GZIP) {
        console.error(`[BUDGET EXCEEDED] Initial chunk ${file} exceeds 180 KB gzip budget: ${gzipKb} KB`);
        hasFailure = true;
      }
    }
  }

  if (hasFailure) {
    console.error(`\n❌ Bundle budget failed: Initial JS exceeds 180 KB gzip limit.`);
    process.exit(1);
  } else {
    console.log(`\n✓ Bundle budget passed: All chunks within performance limits (Max allowed initial JS: 180 KB gzip).\n`);
  }
}

checkBudget();
