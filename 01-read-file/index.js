const fs = require('fs');
const stream = fs.createReadStream('./01-read-file/text.txt', 'utf-8');
let data = '';
stream.on('data', chunk => console.log(chunk));