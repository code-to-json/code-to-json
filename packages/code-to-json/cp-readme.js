const fs = require('fs');
const path = require('path');

fs.writeFileSync('README.md', fs.readFileSync(path.join(__dirname, '..', '..', 'README.md')).toString());
