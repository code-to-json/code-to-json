const fs = require('fs');
const path = require('path');

fs.writeFileSync('README.md', fs.readFileSync(__dirname, '..', '..', 'README.md').toString());
