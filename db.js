var fs = require('fs');

async function openDB() {
    return new Promise((resolve, reject) => {
        fs.readFile('./db.json', (err, data) => {
            try {
                if (err) throw err;
                return resolve(JSON.parse(data))
            } catch (e) {
                reject(e);
            }
        });
    });
}

async function writeTable(table, info) {
    return new Promise((resolve, reject) => {
        openDB().then((data) => {
            if (!data[table]) {
                data[table] = [];
            }
            data[table].push(info);
            fs.writeFile('./db.json', JSON.stringify(data), (err) => {
                if (err) throw err;
                resolve(data);
            });
        });
    });
}

function searchTable(table, object) {
    return new Promise((resolve, reject) => {
        openDB().then((data) => {
            if (!data[table]) {
                data[table] = [];
            }
            let results = [];
            data[table].forEach((element) => {
                let keys = Object.keys(object);
                let matches = 0;
                keys.forEach((key) => {
                    if (element[key] === object[key]) matches++;
                })
                if (matches === keys.length) { results.push(element); }
            });

            if (results.length > 0) resolve(results);

        }).catch((err) => { reject('db error: ' + err) });

    });
}

async function removeFromTable(table, info) {
    return new Promise((resolve, reject) => {
        openDB().then((data) => {
            if (!data[table]) {
                data[table] = [];
            }
            data[table] = data[table].filter(element => element !== info);
            fs.writeFile('./db.json', JSON.stringify(data), (err) => {
                if (err) throw err;
                resolve(data);
            });
        });
    });
}

async function updateTable(table, info) {
    return new Promise((resolve, reject) => {
        searchTable(table, info).then((results) => {
            if (results.length > 0) {
                removeFromTable(table, results[0]).then((data) => {
                    writeTable(table, info).then((data) => {
                        resolve(data);
                    });
                });
            } else {
                resolve(data);
            }
        });
    });
}

async function readTable(table) {
    return new Promise((resolve, reject) => {
        openDB().then((data) => {
            if (!data[table]) {
                data[table] = [];
            }
            resolve(data[table]);
        });
    });
}

module.exports = {
    writeTable,
    searchTable,
    removeFromTable,
    updateTable,
    readTable
}