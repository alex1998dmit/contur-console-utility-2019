const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');
const path = require('path')

app();

function app () {
    let comments = {};
    showAll();
    const files = getFiles();

    console.log('Please, write your command!');
    readLine(processCommand);
}

function getFiles () {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    
    return filePaths.map(path => readFile(path));
}

function createTableHead(imp, author, date, desc, fileName) {
 // Максимальная ширина 1, 10, 10, 50, 15
}

function createBottomLine(imp, author, date, desc, fileName) {

}

function showAll() {

}

function findAllComments() {
    const regExp = /\x2F\x2F TODO(.*)/g;
    files.map((el, index) => {
        comments[path.basename(filePaths[index])] = el.match(regExp);
    });
}

function processCommand (command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            showAll();
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
