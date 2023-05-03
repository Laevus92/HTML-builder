const fs = require('fs');
const path = require('path');
const readline = require('node:readline');
const { stdin: input} = require('node:process');
const filename = path.join(__dirname, 'text.txt');

function openFile() {
  fs.open(filename, 'w', (err) => {
    if (err) throw err;
  });
  fs.writeFile(filename, '', (err) => {
    if (err) throw err;
  });
}


function writeToFile(data) {
  fs.appendFile(filename, (data + '\n'), (err) => {
    if (err) throw err;
  });
}

function runApp() {
  const rl = readline.createInterface({ input, });
  rl.question('', (answer) => {
    if (answer !== 'exit') {
      writeToFile(answer);
      runApp();
    } else {
      console.log('Your text was added in file!\nSee you mate!');
      process.exit();
    }
  });
}
runApp();
openFile();

console.log('You created text file.\nInput your text below:');

process.on('SIGINT', () => {
  console.log('Your text was added in file!\nSee you mate!');
  process.exit();
});