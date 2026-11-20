import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');

const SECRET_PATTERNS = [
  /AIza[0-9A-Za-z\\-_]{35}/, // Google API Key
  /rzp_(?:live|test)_[0-9a-zA-Z]{14}/, // Hardcoded real Razorpay secret (key_secret)
  /(?:secret|private|token)[_-\s]*[:=]\s*["'][0-9a-zA-Z]{16,}["']/i,
  /-----BEGIN [A-Z]+ PRIVATE KEY-----/,
  /sk_live_[0-9a-zA-Z]{24}/, // Stripe live
  /ghp_[0-9a-zA-Z]{36}/, // GitHub PAT
  /AWS_SECRET_ACCESS_KEY/,
];

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`Dist directory does not exist: ${dir}. Run build first.`);
    process.exit(1);
  }

  let hasErrors = false;
  const files = fs.readdirSync(dir, { recursive: true });

  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isFile() && (file.endsWith('.js') || file.endsWith('.html') || file.endsWith('.css'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const pattern of SECRET_PATTERNS) {
        if (pattern.test(content)) {
          console.error(`[SECURITY ERROR] Potential secret leaked in build file: ${file}`);
          console.error(`Pattern matched: ${pattern}`);
          hasErrors = true;
        }
      }
    }
  }

  if (hasErrors) {
    console.error('Security scan failed: Found potential credentials or secrets in production bundle.');
    process.exit(1);
  } else {
    console.log('✓ Security scan passed: No secret-like patterns detected in build output.');
  }
}

scanDirectory(DIST_DIR);
