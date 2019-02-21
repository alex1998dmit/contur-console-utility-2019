const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');
const path = require('path')
const { shortText } = require('./src/utils/comments');
const { getCommentsArrObj } = require('./src/utils/comments');
const { generateTableParams } = require('./src/utils/render');
const { renderRow } = require('./src/utils/render');
const { renderHeadTable } = require('./src/utils/render');


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

module.exports = {
    showAll,
};

