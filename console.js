const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function readLine(callback) {
    rl.on('line', callback); 
}

module.exports = {
    readLine,
};