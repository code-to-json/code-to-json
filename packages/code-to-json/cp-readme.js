const fs = require('fs');

fs.writeFileSync('README.md', fs.readFileSync(__dirname, '..', '..', 'README.md').toString());
