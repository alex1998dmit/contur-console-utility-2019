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

    const tableParams = {
        author: 'author',
        date: 'date', 
        commentsText: 'comment',
        fileName: 'fileNames',
    };


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

    if(comments.length === 0) {
        return { author: tableParams.author, date: tableParams.date, commentText:  tableParams.commentsText, fileName: tableParams.fileName };
    }

    return { 
        author: (authorMax[0].length > 'user'.length) ? authorMax[0].length : 'user'.length, 
        date: dateMax[0].length, 
        commentText: commentTextMax[0].length, 
        fileName: fileNamesMax[0].length
    };
}

function getSpacesParams(obj, params) {    
    const authorLen = Math.abs((params.author - obj.author.length));
    const dateLen =  Math.abs((params.date - obj.date.length));
    const textLen =  Math.abs((params.commentText - obj.commentText.length));
    const fileName =  Math.abs((params.fileName - obj.fileName.length));

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

function renderRow(tableParams, obj) {
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

// -----------User comments--------------------

function sortByName(comments, name) {
    const regExp = new RegExp(`^${name.toLowerCase()}(.*)`, 'g');
    return comments.filter(comment => comment.author.toLowerCase().match(regExp));
}

function showUsersComments(comments, user) {
    let rowLine;
    let sortedCom = sortByName(comments, user);
    sortedCom = shortText(sortedCom);
    tableParams = generateTableParams(sortedCom);

    if(sortedCom.length === 0){
        renderHeadTable(tableParams);
        return ;
    }

    renderHeadTable(tableParams);
    sortedCom.map(comment => {
        rowLine = renderRow(tableParams, comment);
        console.log(rowLine);
    });
    console.log("-".repeat(rowLine.length))
}

// -----------------------------------------------

// -----------Sort------------------------------

function groupBy(objectArray, property) {
    return objectArray.reduce(function (acc, obj) {
      var key = obj[property].toLowerCase();
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  }
  
function sort(comments, oper) {
    
    const byImportant = () => {
        commentsImportant = onlyImportant(comments);
        commentsImportant.sort((a,b) => {
            if(a.commentText.match(/!/g) && b.commentText.match(/!/g)) {
                if (a.commentText.match(/!/g).length > b.commentText.match(/!/g).length) {
                    return -1;
                } else if (a.commentText.match(/!/g).length < b.commentText.match(/!/g).length){
                    return 1;
                }
            }
            return 0;
        });    
        let commentsNoImp = comments.filter(el => !el.isImportant);
        let concatVal = commentsImportant.concat(commentsNoImp)
        return concatVal;
    }

    const byUser = () => {
        sortedWithAuthor = comments.filter(el => el.author);
        const groupedArr = [];
        const groupedObj = groupBy(sortedWithAuthor, 'author');

        for(let key in groupedObj){
            groupedObj[key].map(el => {
                groupedArr.push(el);
            })
        }

        sortedNoAuthor = comments.filter(el => !el.author);
        return groupedArr.concat(sortedNoAuthor);
    }

    const byDate = () => {

    }

    switch (oper) {
        case 'important':
            return byImportant();
        case 'user':
            return byUser();
        case 'date':
            return byDate();
    }
}

function sortByParam(comments, param) {
    let sortedComments = sort(comments,param);
    sortedComments = shortText(sortedComments);
    tableParams = generateTableParams(sortedComments);

    if(sortedComments.length === 0){
        renderHeadTable(tableParams);
        return ;
    }

    renderHeadTable(tableParams);
    sortedComments.map(comment => {
        rowLine = renderRow(tableParams, comment);
        console.log(rowLine);
    });
    console.log("-".repeat(rowLine.length))
}

// ---------------------

function processCommand (command) {
    const commentsArray = getCommentsArrObj();
    command = command.split(" ");

    switch (command[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            showAll(commentsArray);
            break;
        case 'important':
            showImportant(commentsArray);
            break;
        case 'user':
            showUsersComments(commentsArray, command[1]);
            break;
        case 'sort':
            sortByParam(commentsArray, command[1]);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

