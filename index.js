const commentsDir = './src/utils/comments';
const renderDir = './src/utils/render';
const utilsDir = './src/utils/utils';

const { readLine } = require('./console');
const { shortText } = require(commentsDir);
const { getCommentsArrObj } = require(commentsDir);
const { generateTableParams } = require(renderDir);
const { renderRow } = require(renderDir);
const { renderHeadTable } = require(renderDir);
const { onlyImportant } = require(commentsDir);
const { sortByName } = require(commentsDir);
const { groupBy } = require(utilsDir);

app();

function app () {

    console.log('Please, write your command!');
    readLine(processCommand);
}

function bodyRender(comments) {
    let rowLine;   
    comments = shortText(comments);
    tableParams = generateTableParams(comments);
    renderHeadTable(tableParams);

    if(comments.length === 0) {
        return ;
    }
    
    comments.map(comment => {
        rowLine = renderRow(tableParams, comment);
        console.log(rowLine);
    });
    console.log("-".repeat(rowLine.length))
}

const showAll = (comments) =>  bodyRender(comments);

const showImportant = (comments) => bodyRender(onlyImportant(comments));
// TODO DO IT!!!!!

function showUsersComments(comments, user) {
    if(!user) {
        console.log('wrong command');
        return ;
    }
    bodyRender(sortByName(comments, user));
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
        sortedWithAuthor.sort((a,b) => {
            if(a.author > b.author){
                return 1;
            } else if(a.author < b.author) {
                return -1;
            }
            return 0;
        });

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
        let commentsWithDate = comments.filter(el => el.date);
        let commentsSortedByDate = commentsWithDate.sort((a, b) => {
            if(a.date > b.date){
                return -1
            } else if(a.date < b.date){
                return 1;
            } 
            return 0;
        });
        const commentsNoDate = comments.filter(el => !el.date);
        return commentsSortedByDate.concat(commentsNoDate);
    }

    switch (oper) {
        case 'important':
            return byImportant();
        case 'user':
            return byUser();
        case 'date':
            return byDate();
        default: 
            console.log('wrong command');
            return ;
            break;
    }
}


function showSortByParam(comments, param) {    
    const optionsSort = ['important', 'user', 'date'];
    if(!optionsSort.includes(param)) {
        console.log('wrong command');
        return ;
    }
    bodyRender(sort(comments,param));
}


function showByDate(comments, param) {
    if(new Date(param) == 'Invalid Date') {
        console.log('wrong command');
        return ;
    }
    bodyRender(comments.filter(com => com.date >= param));
}

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
            showSortByParam(commentsArray, command[1]);
            break;
        case 'date':
            showByDate(commentsArray, command[1]);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

