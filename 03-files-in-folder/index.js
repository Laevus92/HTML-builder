const fs = require('fs/promises');
const path = require('path');
const foldDirectory = path.join(__dirname, 'secret-folder');
const files = fs.readdir(foldDirectory, {withFileTypes : true});

async function checkFolder() {
  (await files).forEach(file => {
    if (file.isFile()) {
      let [fileName] = file['name'].split('.');
      let extension = path.extname(file['name']).slice(1);
      let fileInfo = fs.stat(path.join(__dirname, 'secret-folder', file['name']));
      let result = `${fileName} - ${extension}`;
      checkSize(result, fileInfo);
    }
  });
  async function checkSize(data, file) {
    console.log(`${data} - ${(((await file).size) / 1024)}kb`);
  }
}

checkFolder();