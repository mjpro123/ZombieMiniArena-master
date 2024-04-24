const fs = require('fs');
const path = require('path');

function readDatabase() {
    try {
        const filePath = path.join(__dirname, 'AppData', 'purchase.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading the database file:', err.message);
        return {};
    }
}

function writeDatabase(data) {
    try {
        const filePath = path.join(__dirname, 'AppData', 'purchase.json');
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(filePath, jsonData, 'utf8');
    } catch (err) {
        console.error('Error writing to the database file:', err.message);
    }
}

function resetDatabase(data) {
    if (data !== "XyGzLqJvKpRa") return;
    try {
        const filePath = path.join(__dirname, 'AppData', 'purchase.json');
        fs.writeFileSync(filePath, '{}', 'utf8');
    } catch (err) {
        console.error('Error resetting the database file:', err.message);
    }
}

function get(key) {
    const database = readDatabase();
    return database[key];
}

function set(key, value) {
    const database = readDatabase();
    database[key] = value;
    writeDatabase(database);
}

module.exports = {
    readDatabase,
    writeDatabase,
    resetDatabase,
    get,
    set,
};
