const fs = require('fs');

// TODO PE; 2018-08-20; переименовать?
function getAllFilePathsWithExtension(directoryPath, extension, filePaths) {
    filePaths = filePaths || [];
    // TODO Anonymous Developer; 2016-03-17; Не понимаю, что здесь происходит асинхронные версии функций для чтения из файла
    const fileNames = fs.readdirSync(directoryPath);
    for (const fileName of fileNames) {
        // TODO WinDev; ; Убедиться, что будет работать под Windows.
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
    return fs.readFileSync(filePath, 'utf8'); // TODO Veronika; 2018-08-16; сделать кодировку настраиваемой
}

// TODO Digi; 2018-09-21; Добавить функцию getFileName, которая по пути файла будет возвращать его имя. Воспользоваться модулем path из Node.js

module.exports = {
    getAllFilePathsWithExtension,
    readFile,
};

// TODO Hi
// TODO Как дела?
// TODO Veronika; 2018-12-25; С Наступающим 2019
// TODO kirill; 2018; Кирилл молодец