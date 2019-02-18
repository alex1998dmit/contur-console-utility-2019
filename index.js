const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');
const path = require('path')

app();

function app () {
    let files = getFiles();

    console.log('Please, write your command!');
    readLine(processCommand);
}

function getFiles () {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getFilesPath() {
    return getAllFilePathsWithExtension(process.cwd(), 'js');
}

function createTableHead(imp, author, date, desc, fileName) {
 // Максимальная ширина 1, 10, 10, 50, 15
    console.log('!  |  user  |  date  |  comment  |  fileName  ');
    // | ! *число-символов| 
                    //   someone              
}

function createBottomLine(imp, author, date, desc, fileName) {

}

function render(obj) {
    obj.author = (obj.author.length < 10) ? obj.author : obj.author.substr(0, 3) + '...';
    // obj.date = obj.date.length < 10 ? obj.date : obj.date.length.substr(0,3) + '...';
    obj.commentText = (obj.commentText.length < 50) ? obj.commentText : obj.commentText.substr(0,43) + '...';
    obj.fileName = (obj.fileName.length < 15) ? obj.length : obj.length.substr(0,8) + '...';
    obj.isImportant = (obj.isImportant) ? obj.isImportant : " ";
    console.log(`|  ${obj.isImportant}  |  ${obj.author}  |  ${obj.date}  |  ${obj.commentText}  |  ${obj.fileName}  |`);
    // console.log(obj);
}

function show(comments) {
    // Показать все TODO
    const curComment = {};
    for(let key in comments){
        const fileName = key;
        // key -  название файла
        if(comments[key]){
            comments[key].map(comment => {
                // comment - текущий комментарий
                // console.log(comment);
                comment = comment.replace('\x2F\x2F TODO ',';');
                let commentArray = comment.split(";");
                commentArray.splice(0, 1);
                // commentArray - массив из деталей комментария 
                curComment.author = commentArray[0];
                curComment.date = commentArray[1];
                curComment.commentText = commentArray[2];
                curComment.isImportant = (!!(~curComment.commentText.indexOf('!'))) ? '!' : '';
                curComment.fileName = key;
                // console.log(curComment);
                render(curComment);
            });
        }
        // console.log(comments[key]);
    }    
}

function findAllComments() {
    const files = getFiles();
    const obj = {};
    const regExp = /\x2F\x2F TODO(.*)/g;
    const filePaths = getFilesPath();

    files.map((el, index) => {
        obj[path.basename(filePaths[index])] = el.match(regExp);
    });
    return obj;
}

function processCommand (command) {
    const comments = findAllComments();

    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            show(comments);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

