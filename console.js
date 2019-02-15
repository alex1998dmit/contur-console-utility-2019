const readline = require('readline');

// TODO ; 2018-10-01; Можно ли написать более лаконично?
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function readLine(callback) {
    rl.on('line', callback); // TODO pe; 2015-08-10; а какая будет кодировка?
}

// TODO digi; 2016-04-08; добавить writeLine!!!

module.exports = {
    readLine,
};
