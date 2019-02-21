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

