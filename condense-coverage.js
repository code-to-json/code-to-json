const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const { promisify } = require('util');

(async function() {
  const COVERAGE_DIR = path.join(__dirname, 'coverage');
  const PACKAGES_DIR = path.join(__dirname, 'packages');

  const pRimraf = promisify(rimraf);

  if (fs.existsSync(COVERAGE_DIR)) {
    await pRimraf(COVERAGE_DIR);
  }
  fs.mkdirSync(COVERAGE_DIR);

  const packagePaths = fs
    .readdirSync(PACKAGES_DIR)
    .map(f => ({ name: f, path: path.join(PACKAGES_DIR, f) }))
    .filter(f => fs.statSync(f.path).isDirectory());

  const covPaths = packagePaths
    .map(pkgPath => {
      const covPath = path.join(pkgPath.path, 'coverage', 'lcov.info');
      if (!fs.existsSync(covPath)) {
        return null;
      }
      return { ...pkgPath, covPath };
    })
    .filter(Boolean);

  const out = [''];
  covPaths.forEach(cp => {
    out.push(fs.readFileSync(cp.covPath).toString());
  });

  fs.writeFileSync(path.join(COVERAGE_DIR, 'merged.lcov'), out.join('\n'));
})();
