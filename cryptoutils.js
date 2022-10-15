const crypto = require('crypto');

function generateSalt(length=4) {
    return crypto.randomBytes(length).toString('hex');
}

function getStringHash(string) {
    return crypto.createHash('md5').update(string).digest('hex');
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

module.exports = { generateSalt, getStringHash, generateOTP }
