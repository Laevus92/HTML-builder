const fs = require('fs');
const path = require('path');

async function copyDir(source, target) {

  try {
    await fs.promises.rm(target, { recursive: true });
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }

  await fs.promises.mkdir(target);

  const files = await fs.promises.readdir(source);

  for (const file of files) {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);

    const stat = await fs.promises.stat(sourcePath);

    if (stat.isDirectory()) {
      await copyDir(sourcePath, targetPath);
    } else {
      await fs.promises.copyFile(sourcePath, targetPath);
    }
  }
}

async function mergeFiles(sourceDir, targetFile) {
  //remove bundle.css
  try {
    await fs.promises.unlink(targetFile);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }

  //create new style.css
  (await fs.promises.open(targetFile, 'w')).close();
  let data = '';
  const files = await fs.promises.readdir(sourceDir, {withFileTypes : true});
  for (const file of files) {
    if (file.isFile() && path.extname(file['name']) === '.css') {
      const stream = fs.createReadStream(path.join(sourceDir, file['name']), 'utf-8');
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
}

async function buildPage() {
  //remove project-dist folder
  try {
    await fs.promises.rm(path.join(__dirname, 'project-dist'), { recursive: true });
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
  // //create new project-dist folder
  await fs.promises.mkdir(path.join(__dirname, 'project-dist'));
  //copy assets
  const assetsSource = path.join(__dirname, 'assets');
  const assetsTarget = path.join(__dirname, 'project-dist', 'assets');
  copyDir(assetsSource, assetsTarget);

  // merge style.css
  const mergedStyle = path.join(__dirname, 'project-dist', 'style.css');
  const sourseOfStyles = path.join(__dirname, 'styles');
  mergeFiles(sourseOfStyles, mergedStyle);
  //create object with components
  let componentsObject = {};
  const componentsSource = path.join(__dirname, 'components');
  const components = await fs.promises.readdir(componentsSource, { withFileTypes: true });
  const indexHtmlTarget = path.join(__dirname, 'project-dist', 'index.html');
  function createComponentObject() {
    return new Promise((res, rej) => {
      for (const file of components) {
        if (file.isFile() && path.extname(file['name']) === '.html') {
          const stream = fs.createReadStream(path.join(componentsSource, file['name']), 'utf-8');
          let data = '';
          let key = `{{${file['name'].split('.')[0]}}}`;
          stream.on('data', (chunk) => {
            data += chunk;
          });
          stream.on('end', () => {
            componentsObject[key] = data;
            res(componentsObject);
          });
          stream.on('error', rej);
        }
      }
    });
  }
  await createComponentObject();
  // create variable with code from template.html
  let templateData = '';
  const template = path.join(__dirname, 'template.html');
  function createtemplateData() {
    return new Promise((res, rej) => {
      const stream = fs.createReadStream(template, 'utf-8');
      let data ='';
      stream.on('data', chunk => {
        data += chunk;
      });
      stream.on('end', () => {
        templateData = data;
        res(templateData);
      });
      stream.on('error', rej);
    });
  }
  await createtemplateData();
  // replace code in template.html
  for (let key in componentsObject) {
    templateData = templateData.replace(key, componentsObject[key]);
  }
  //create index.html
  try {
    await fs.promises.unlink(indexHtmlTarget);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
  (await fs.promises.open(indexHtmlTarget, 'w')).close();
  await fs.promises.writeFile(indexHtmlTarget, templateData);
  console.log('__SUCCESSFUL!__');
}

buildPage();