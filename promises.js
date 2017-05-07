/**
 * Created by Стас on 07.05.2017.
 */
const fs = require('fs');
const rmdir = require('rmdir');

//-----------— dirs handlers

function removeDir() {
    return new Promise((resolve, reject) => {
        rmdir('./results', err => {
            if (err) {
                resolve(err);
                console.log(err);
            }
            else resolve('results removed successfully')
        })
    });
}

function createDir() {
    return new Promise((resolve, reject) => {
        fs.mkdir('./results', err => {
            if (err) console.log(err);
            else {
                resolve('results created successfully')
            }
        })
    });
}

//------------------------------------------//

//-----------— files handlers

/*function removeFile(path) {
    return new Promise((resolve, reject) => {
        fs.unlink(path, err => {
            if (err) reject(err);
            else resolve('file ' + path + 'removed successfully')
        })
    });
}*/

function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) reject (err);
            else resolve (data);
        })
    });
}

function writeDataToFile(data) {
    return new Promise((resolve, reject) => {
        console.log('Write data to file output_'+ data.char + '.txt');
        fs.writeFile('results/output_' + data.char + '.txt', data.result, 'utf8', err => {
            if (err) reject (err);
            else {
                console.log('Data was written to file output_'+ data.char + '.txt');
                resolve({
                    char: data.char,
                    count: data.count
                });
            }
        })
    });
}

//------------------------------------------//


/*function findSubStr(data, subStr, pos) {
    return new Promise((resolve, reject) => {
        let subStrPos = data.toLowerCase().indexOf(subStr, pos);
        if (subStrPos !== -1) resolve(subStrPos);
        else reject({error: 'no such subStr in our file'})
    });
}*/

function createPromisesArr(data) {
    let ch = 'a';
    let promiseArr = [];
    while (ch<='z') {
        promiseArr.push(findAllPositions(data, ch).catch(err => console.log(err)));
        ch = String.fromCharCode(ch.charCodeAt(0)+1);
    } 
    return promiseArr;
}

function findAllPositions(data, subStr) {
    return new Promise((resolve, reject) => {
        console.log("Start letter " + subStr);
        let result = '';
        let position = data.toLowerCase().indexOf(subStr);
        let count = 0;
        if (position === -1) {
            console.log("Letter " + subStr + " not found" );
            resolve(writeDataToFile({
                result: result,
                char: subStr,
                count: count
            }));
        }
        else {
            while (position !== -1) {
                result += position +',';
                count++;
                position = data.toLowerCase().indexOf(subStr, position + 1);
            }
            console.log("Letter " + subStr + " completed" );
            resolve(writeDataToFile({
                result: result.substr(0, result.length - 1),
                char: subStr,
                count: count
            }));
        }
    });
}

removeDir()
    .then(msg => {
        console.log(msg);
        return createDir();
    })
    .then(msg => {
        console.log(msg);
        return readFile('input.txt');
    })
    .then(data => Promise.all(createPromisesArr(data))
        .then(data => {
            let resultStr = '';
            data.forEach((item) => resultStr += item.char + '=' + item.count + '\n');
            return resultStr.substr(0, resultStr.length - 1);
        })
        .then(resultStr => writeDataToFile({
            result: resultStr,
            char: 'summary',
            count: true
        }))
    )
    .catch(err => console.log(err));