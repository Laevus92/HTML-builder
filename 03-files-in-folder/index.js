const fs = require('fs/promises');
const path = require('path');
const foldDirectory = path.join(__dirname, 'secret-folder');
const files = fs.readdir(foldDirectory, {withFileTypes : true});

async function checkFolder() {
  (await files).forEach(file => {
    if (file.isFile()) {
      let extension = path.extname(file['name']);
      let fileInfo = fs.stat(path.join(foldDirectory, file['name']));
      let fileName = file['name'].replace(extension, '');
      let result = `${fileName} - ${extension.slice(1)}`;
      checkSize(result, fileInfo);
    }
  });
  async function checkSize(data, file) {
    console.log(`${data} - ${(((await file).size) / 1024)}kb`);
  }
}

checkFolder();