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

// ---------------------------------

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

    return { author: authorMax[0].length, date: dateMax[0].length, commentText: commentTextMax[0].length, fileName: fileNamesMax[0].length};
}

function getSpacesParams(obj, params) {
    const authorLen = (params.author - obj.author.length);
    const dateLen = (params.date - obj.date.length);
    const textLen = (params.commentText - obj.commentText.length);
    const fileName = (params.fileName - obj.fileName.length);

    const newObj = 
    { 
        author: authorLen,
        date: dateLen,
        text: textLen,
        fileName: fileName, 
    };

    return newObj;
}

// ---------------------------------------------

function renderRow(params, obj) {
    let spacesObj = getSpacesParams(obj, tableParams);
    let spaces = {
        authorR: " ".repeat(spacesObj.author),
        dateR: " ".repeat(spacesObj.date),
        textR: " ".repeat(spacesObj.text),
        fileNameR: " ".repeat(spacesObj.fileName),
    };
    const rowLine = `  ${obj.isImportant}  |  ${obj.author}${spaces.authorR}  |  ${obj.date}${spaces.dateR}  |  ${obj.commentText}${spaces.textR}  |  ${obj.fileName}${spaces.fileNameR}  `;
    return rowLine;
}

function renderHeadTable(params) {
    const obj = {
        isImportant: '!',
        author: 'user',
        date: 'date', 
        commentText: 'comment',
        fileName: 'fileName'
    };

    let rowLine = renderRow(params, obj);
    let len = rowLine.lenght;

    console.log(rowLine);
    console.log("-".repeat(rowLine.length));
}

// ---------------------------------------------------

function createMasComments(comments) {
    let commentsArray = [];
    let commentArray;
    for(let key in comments) {
        fileName = key;
        if(comments[key]) {
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
}

function getCommentsArrObj() {
    const comments = findAllComments();
    let commentsArray = createMasComments(comments);
    let commentsObjArray = [];
    commentsObjArray = commentsArray.map((commentArray) => {
        return {
            author: (commentArray.length > 2) ? commentArray[0].trim() : '', 
            date: (commentArray.length > 2) ? commentArray[1].trim() : '', 
            commentText: (commentArray.length > 2) ? commentArray[2].trim() : commentArray[0].trim(), 
            fileName: (commentArray.length > 2) ? commentArray[3] : commentArray[1],
        };
    });
    return isImportantComment(commentsObjArray);
}

// ------------------SHOW ALL----------------------------

function showAll(comments) { 
    let rowLine;   
    comments = shortText(comments);
    tableParams = generateTableParams(comments);

    renderHeadTable(tableParams);
    comments.map(comment => {
        rowLine = renderRow(tableParams, comment);
        console.log(rowLine);
    });
    console.log("-".repeat(rowLine.length))
}

// ------------------------------------

// ------------important------------------

function onlyImportant(comments) {
    let res = [];
    return comments.filter(comment => {
        if(comment.isImportant){
            return comment;
        }
    });
}

function showImportant(comments) {
    let rowLine;
    let importantComments = onlyImportant(comments);
    importantComments = shortText(importantComments);
    tableParams = generateTableParams(importantComments);

    renderHeadTable(tableParams);
    importantComments.map(comment => {
        rowLine = renderRow(tableParams, comment);
        console.log(rowLine);
    });
    console.log("-".repeat(rowLine.length))
}

function processCommand (command) {
    const commentsArray = getCommentsArrObj();

    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            showAll(commentsArray);
            break;
        case 'important':
            showImportant(commentsArray);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO Hi!
// TODO Как дела?
// TODO Veronika; 2018-12-25; С Наступающим 2019!
// TODO pe; 2018-12-26; Работать пора!!!
// TODO Не понимаю, что здесь происходит...