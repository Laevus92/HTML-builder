const fs = require('fs/promises');
const path = require('path');
const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

async function copyDir(source, target) {

  try {
    await fs.rm(target, { recursive: true });
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }

  await fs.mkdir(target);

  const files = await fs.readdir(source);

  for (const file of files) {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);

    const stat = await fs.stat(sourcePath);

    if (stat.isDirectory()) {
      await copyDir(sourcePath, targetPath);
    } else {
      await fs.copyFile(sourcePath, targetPath);
    }
  }
  console.log('__SUCCESSFUL!__');
}

copyDir(sourceDir, targetDir);
