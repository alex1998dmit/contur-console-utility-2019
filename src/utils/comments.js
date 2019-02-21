const { getAllFilePathsWithExtension, readFile } = require('../../fileSystem');
const path = require('path');

function getFiles () {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getFilesPath() {
    return getAllFilePathsWithExtension(process.cwd(), 'js');
}

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
        obj.author = (obj.author.length < 10) ? obj.author : obj.author.substr(0, 7) + '...';
        obj.commentText = (obj.commentText.length < 50) ? obj.commentText : obj.commentText.substr(0,47) + '...';
        obj.fileName = (obj.fileName.length < 15) ? obj.fileName : obj.fileName.substr(0,12) + '...';
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

function onlyImportant(comments) {
    let res = [];
    return comments.filter(comment => {
        if(comment.isImportant){
            return comment;
        }
    });
}

function sortByName(comments, name) {
    const regExp = new RegExp(`^${name.toLowerCase()}(.*)`, 'g');
    return comments.filter(comment => comment.author.toLowerCase().match(regExp));
}




module.exports = {
    shortText,
    getCommentsArrObj,
    onlyImportant,
    sortByName,
};

