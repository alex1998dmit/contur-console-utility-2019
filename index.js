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

function createMasComments(comments) {
    let commentsArray = [];
    let commentArray;
    for(let key in comments) {
        fileName = key;
        if(comments[key]) {
            // console.log(key);
            comments[key].map(com => {
                com = com.replace('\x2F\x2F TODO ',';');
                commentArray = com.split(";");
                commentArray.splice(0, 1);    
                commentArray.push(key);
                commentsArray.push(commentArray);
            });
        }
    }
    return commentsArray;
}

function isImportantComment(obj) {
    return obj.map(el => {
        el.isImportant = (!!(~el.commentText.indexOf('!'))) ? '!' : '';
        return el;
    });
}


function getCommentsArrObj(comments) {
    let commentsArray = createMasComments(comments);
    let commentsObjArray = [];
    commentsObjArray = commentsArray.map((commentArray) => {
        return {author: commentArray[0], date: commentArray[1], commentText: commentArray[2], fileName: commentArray[3]};
    });
    return isImportantComment(commentsObjArray);
}

/* 
Формирование объекта из всех комментариев на странице 
    {fileName: [comment_texts]}
*/
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

function shortText(comments) {
    return comments.map(obj => {
        obj.author = (obj.author.length < 10) ? obj.author : obj.author.substr(0, 3) + '...';
        // obj.date = obj.date.length < 10 ? obj.date : obj.date.length.substr(0,3) + '...';
        obj.commentText = (obj.commentText.length < 50) ? obj.commentText : obj.commentText.substr(0,43) + '...';
        obj.fileName = (obj.fileName.length < 15) ? obj.fileName : obj.fileName.substr(0,8) + '...';
        obj.isImportant = (obj.isImportant) ? obj.isImportant : " ";
        return obj;
    });    
    // console.log(`|  ${obj.isImportant}  |  ${obj.author}  |  ${obj.date}  |  ${obj.commentText}  |  ${obj.fileName}  |`);
}

function generateTableParams(comments) {
    let authors = [];
    let dates = []; 
    let commentTexts = [];
    let fileNames = [];

    const sortReduce = (p, c, i, a) => a[p].length > c.length ? p : i;

    comments.map(el => {
        authors.push(el.author);
        dates.push(el.date);
        commentTexts.push(el.commentText);
        fileNames.push(el.fileName);
    });
    
    const authorMax = authors.reduce((p, c, i, a) => sortReduce(p, c, i, a), 0);
    const dateMax = dates.reduce((p, c, i, a) => sortReduce(p, c, i, a), 0);
    const commentTextMax = commentTexts.reduce((p, c, i, a) => sortReduce(p, c, i, a), 0);
    const fileNamesMax = fileNames.reduce((p, c, i, a) => sortReduce(p, c, i, a), 0);

    return { author: authorMax, date: dateMax, commentText: commentTextMax, fileName: fileNamesMax};
}

function getSpaces(params) {
    // const usrSpace = " ".repeat(4);
    // const  
    // console.log(usrSpace, 2);
    return { usrSpace: " ".repeat((params.author - 4) / 2), dateSpace: " ".repeat((params.date - 4) / 2), 
    commentTextSpace: " ".repeat((params.commentText - 7) / 2), fileNameSpace: " ".repeat((params.fileName - 8) /2) };
}

function show(comments) {    
    comments = shortText(comments);
    tableParams = generateTableParams(comments);
    console.log(tableParams);
    let spaces = getSpaces(tableParams);
    console.log(spaces);
    console.log('|  !  |' + spaces.usrSpace + 'user' + spaces.usrSpace  + '|' + spaces.dateSpace + 'date' + spaces.dateSpace + '|' + spaces.commentTextSpace 
    + 'comment' + spaces.commentTextSpace + spaces.fileNameSpace + 'fileName' + spaces.fileNameSpace)    ;
}

/* 
    Команды 
*/
function processCommand (command) {
    const comments = findAllComments();
    const commentsArray = getCommentsArrObj(comments);

    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            show(commentsArray);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

