const fs = require('fs');

//  PE; 2018-08-20; переименовать?
function getAllFilePathsWithExtension(directoryPath, extension, filePaths) {
    filePaths = filePaths || [];
    //  Anonymous Developer; 2016-03-17; Не понимаю, что здесь происходит асинхронные версии функций для чтения из файла
    const fileNames = fs.readdirSync(directoryPath);
    for (const fileName of fileNames) {
        //  WinDev; ; Убедиться, что будет работать под Windows.
        const filePath = directoryPath + '/' + fileName;
        if (fs.statSync(filePath).isDirectory()) {
            getAllFilePathsWithExtension(filePath, filePaths);
        } else if (filePath.endsWith(`.${extension}`)) {
            filePaths.push(filePath);
        }
    }
    return filePaths;
}

function readFile(filePath) {
    return fs.readFileSync(filePath, 'utf8'); // Tмой
}



module.exports = {
    getAllFilePathsWithExtension,
    readFile,
};
