const fs = require('fs');
const path = require('path');
const sourceDir = path.join(__dirname, 'styles');
const targetFile = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeFiles() {
  //remove bundle.css
  try {
    await fs.promises.unlink(targetFile);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }

  //create new bundle.css
  (await fs.promises.open(targetFile, 'w')).close();
  let data = '';
  const files = await fs.promises.readdir(sourceDir, {withFileTypes : true});
  for (const file of files) {
    if (file.isFile() && path.extname(file['name']) === '.css') {
      const stream = fs.createReadStream(path.join(sourceDir, file['name']));
      stream.on('data', (chunk) => {
        data += chunk;
      });
      stream.on('end', () => {
        fs.appendFile(targetFile, data, err => {
          if (err) throw err;
        });
        data = '';
      });
    }
  }
  console.log('__SUCCESSFUL!__');
}

mergeFiles();