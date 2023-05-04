const { constants } = require('buffer');
const fs = require('fs/promises');
const path = require('path');
const files = fs.readdir(path.join(__dirname, 'files'));

async function createFolder() {
  await fs.mkdir(path.join(__dirname, 'files-copy'), {recursive : true} );
}
async function copyPaste() {
  (await files).forEach(file => {
    fs.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file), constants.COPYFILE_EXCL);
  });
}

createFolder();
copyPaste();
console.log('__SUCCSESS__');
