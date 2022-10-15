const sqlite3 = require('sqlite3');

const cu = require('./cryptoutils');

const DB = new sqlite3.Database('./db/users.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.log(err);
        process.exit();
    }
});

const CREATE_SQL = `CREATE TABLE IF NOT EXISTS users(username TEXT PRIMARY KEY, email TEXT, password TEXT, hash TEXT)`;
const INSERT_SQL = `INSERT INTO users VALUES (?, ?, ?, ?)`;
const UPDATE_PASS = `UPDATE users SET password = ? WHERE email = ?`;
const NEW_PASS = `UPDATE users SET password = ? WHERE username = ?`;

DB.run(CREATE_SQL);
// DB.run(INSERT_SQL, ['admin', 'admin@authbot.com', 'admin', 'f5866c4a4d6014ecced47960c2e3d07f']);

// Returns a row corresponding to the username
function getEmailPassword(username, callback) {
    DB.get('SELECT email, password FROM users WHERE username = ?', [username], callback);
}

function checkEmail(email, callback) {
    DB.get('SELECT email FROM users WHERE email = ?', [email], callback);
}

// Save user details to database
function saveUser(username, email, password, hash, callback) {
    DB.run(INSERT_SQL, [username, email, password, hash], callback);
}

// Check for hash
function checkHash(username, callback) {
    DB.get('SELECT hash FROM users WHERE username = ?', [username], callback);
}

// Reset password for username
function changePassword(email, newpassword) {
    DB.run(UPDATE_PASS, [newpassword, email]);
}

// Set new password for username
function newPassword(username, password) {
    DB.run(NEW_PASS, [password, username]);
}

module.exports = {getEmailPassword, checkEmail, saveUser, checkHash, changePassword, newPassword}
