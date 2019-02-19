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

    const fn = (a, b) => {
        if (a.length > b.length) return -1;
        if (a.length < b.length) return 1;
    }

    comments.map(el => {
        authors.push(el.author);
        dates.push(el.date);
        commentTexts.push(el.commentText);
        fileNames.push(el.fileName);
    });
    
    const authorMax = authors.sort(fn);
    const dateMax = dates.sort(fn);
    const commentTextMax = commentTexts.sort(fn);
    const fileNamesMax = fileNames.sort(fn);
    // console.log()

    return { author: authorMax[0].length, date: dateMax[0].length, commentText: commentTextMax[0].length, fileName: fileNamesMax[0].length};
}

function getSpaces(params, desc) {
    desc =  desc || ['!', 'user', 'date', 'comment', 'fileName'];
    let imp = desc[0];
    let fourRepeat = desc[1] > 4 ? (params.author - 4) / 2 : 0;
    let sevenRepeat =  desc[2] > 7 ? (params.commentText - 7)/2 : 0;
    let eightRepeat = desc[3]  > 8 ? ((params.fileName - 8) /2) : 0;

    let usr = " ".repeat(fourRepeat) + desc[1] + " ".repeat(fourRepeat);
    let date = " ".repeat(fourRepeat) + desc[2] + " ".repeat(fourRepeat);
    let com = " ".repeat(sevenRepeat) + desc[3] + " ".repeat(sevenRepeat);
    let file = " ".repeat(eightRepeat) + desc[4] + " ".repeat(eightRepeat);
    return { important:imp , usrSpace: usr, dateSpace: date,  commentTextSpace: com, fileNameSpace: file };
}


function showAll(comments, params) {
    // comments.map(comment => {
    //     let spaces = getSpaces(comment, [comment.isImportant]);
    //     console.log(`|  ${comment.isImportant}  |  ${comment.author}  |  ${comment.date}  |  ${comment.commentText}  |  ${comment.fileName}  |`);
    // });
    let spaces = getSpaces(params, [comments[0].isImportant, comments[0].author, comments[0].date, comments[0].commentText, comments[0].fileName]);
    console.log(`|  ${spaces.important}  |  ${spaces.usrSpace}  |  ${spaces.dateSpace}  |  ${spaces.commentTextSpace}  |  ${spaces.fileNameSpace}  |`);

}

function getSpacesParams(obj, params) {
    const authorLen = (params.author - obj.author.length)/2;
    const dateLen = (params.date - obj.date.length)/2;
    const textLen = (params.commentText - obj.commentText.length)/2;
    const fileName = (params.fileName - obj.fileName.length)/2;

    const newObj = 
    { 
        author: [Math.floor(authorLen), Math.ceil(authorLen)],
        date: [Math.floor(dateLen), Math.ceil(dateLen)],
        text: [Math.floor(textLen), Math.ceil(textLen)],
        fileName: [Math.floor(fileName), Math.ceil(fileName)]
    };

    return newObj;
}

function renderHeadTable(params) {
    const obj = {
        isImportant: '!',
        author: 'user',
        date: 'date', 
        commentText: 'comment',
        fileName: 'fileName'
    }

    let spacesObj = getSpacesParams(obj, tableParams);
    let spaces = {
        authorL: " ".repeat(spacesObj.author[0]),
        authorR: " ".repeat(spacesObj.author[1]),
        dateL: " ".repeat(spacesObj.date[0]),
        dateR: " ".repeat(spacesObj.date[1]),
        textL: " ".repeat(spacesObj.text[0]),
        textR: " ".repeat(spacesObj.text[1]),
        fileNameL: " ".repeat(spacesObj.fileName[0]),
        fileNameR: " ".repeat(spacesObj.fileName[1]),
    };

    const headLen = `|  ${obj.isImportant}  |  ${spaces.authorL}${obj.author}${spaces.authorR}  |${spaces.dateL}${obj.date}${spaces.dateR}  |${spaces.textL}${obj.commentText}${spaces.textR}  |  ${spaces.fileNameL}${obj.fileName}${spaces.fileNameR}|`.length;
    console.log(`|  ${obj.isImportant}  |  ${spaces.authorL}${obj.author}${spaces.authorR}  |  ${spaces.dateL}${obj.date}${spaces.dateR}  |  ${spaces.textL}${obj.commentText}${spaces.textR}  |  ${spaces.fileNameL}${obj.fileName}${spaces.fileNameR}  |`);
    console.log("-".repeat(headLen));
}

function show(comments) {    
    comments = shortText(comments);
    tableParams = generateTableParams(comments);

    renderHeadTable(tableParams);
    comments.map(comment => {
        let spacesObj = getSpacesParams(comment, tableParams);
        let spaces = {
            authorL: " ".repeat(spacesObj.author[0]),
            authorR: " ".repeat(spacesObj.author[1]),
            dateL: " ".repeat(spacesObj.date[0]),
            dateR: " ".repeat(spacesObj.date[1]),
            textL: " ".repeat(spacesObj.text[0]),
            textR: " ".repeat(spacesObj.text[1]),
            fileNameL: " ".repeat(spacesObj.fileName[0]),
            fileNameR: " ".repeat(spacesObj.fileName[1]),
        };
        console.log(`|  ${comment.isImportant}  |  ${spaces.authorL}${comment.author}${spaces.authorR}  |  ${spaces.dateL}${comment.date}${spaces.dateR}  |  ${spaces.textL}${comment.commentText}${spaces.textR}  |  ${spaces.fileNameL}${comment.fileName}${spaces.fileNameR}  |`);
    });
    // console.log(`|  ${spaces.important}  |  ${spaces.usrSpace}  |  ${spaces.dateSpace}  |  ${spaces.commentTextSpace}  |  ${spaces.fileNameSpace}  |`);
    // console.log(comments);
    // showAll(comments, tableParams);
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

