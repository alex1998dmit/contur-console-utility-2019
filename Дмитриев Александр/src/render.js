function shortText(comments) {
    return comments.map(obj => {
        obj.author = (obj.author.length < 10) ? obj.author : obj.author.substr(0, 7) + '...';
        obj.commentText = (obj.commentText.length < 50) ? obj.commentText : obj.commentText.substr(0,47) + '...';
        obj.fileName = (obj.fileName.length < 15) ? obj.fileName : obj.fileName.substr(0,12) + '...';
        obj.isImportant = (obj.isImportant) ? obj.isImportant : " ";
        return obj;
    });    
}

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
        date: (dateMax[0].length > tableParams.date.length) ? dateMax[0].length : tableParams.date.length, 
        commentText: (commentTextMax[0].length > tableParams.commentsText.length) ? commentTextMax[0].length : tableParams.commentsText.length, 
        fileName: (fileNamesMax[0].length > tableParams.fileName.length) ? fileNamesMax[0].length : tableParams.fileName.length,
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

function renderRow(tableParams, obj) {
    const spacesObj = getSpacesParams(obj, tableParams);
    const spaces = {
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

    const rowLine = renderRow(params, obj);
    const len = rowLine.lenght;
    const bottomLine = "-".repeat(rowLine.length)

    return { content: rowLine + '\n' + bottomLine + '\n', len: rowLine.length};
}

function bodyRender(comments) {
    let rowLine = '';   
    comments = shortText(comments);
    tableParams = generateTableParams(comments);
    const head = renderHeadTable(tableParams);
    const headContent =head.content;
    const len = head.len;
    const bottomLine = "-".repeat(len)

    if(comments.length === 0) {
        return headContent;
    }
    
    comments.map(comment => {
        rowLine = rowLine + renderRow(tableParams, comment) + '\n';
    });
    return headContent + rowLine + bottomLine;
}

module.exports = {
    getSpacesParams, 
    generateTableParams,
    renderRow, 
    renderHeadTable,
    bodyRender,
};