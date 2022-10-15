const fs = require('fs');

const express = require('express');
const qr = require('qrcode');
const fileupload = require('express-fileupload');
const jimp = require("jimp");
const qreader = require('qrcode-reader');

const cu = require('./cryptoutils');
const db = require('./db');
const mailer = require('./mailer');

const app = express();

const OTP_MAP = new Map();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileupload());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/reset', (req, res) => {
    res.render('reset');
})

app.post('/reset', (req, res) => {
    const email = req.body.email;
    console.log(`Resetting password for ${email}`);
    const newpassword = cu.generateSalt();
    db.changePassword(email, newpassword);
    mailer.sendReset(newpassword, email);
    res.render('reset', {complete: true});
});

app.post('/login', (req, res) => {
    const {username, password} = req.body;
    // Check for usename and password in database
    db.getEmailPassword(username, (err, row) => {
        if (row && row.password == password) {
            const email = row.email;
            const OTP = cu.generateOTP();
            console.log(`OTP Generated for ${username}: ${OTP}`);
            OTP_MAP.set(username, OTP);
            mailer.sendOTP(OTP, email);
            return res.render('auth', {username});
        }
        return res.render('index', {username, invalid: true});
    });
});

app.post('/validate', (req, res) => {
    const {username, otp} = req.body;

    if (otp != OTP_MAP.get(username)) {
        return res.render('auth', {username, invalid: true});
    }

    const qrcode = req.files.qrcode;
    const filename = `./upload/${qrcode.name}`;

    qrcode.mv(filename, (err) => {
        if (err) return res.render('auth', {username, invalid: true});

        // Validate QR Code
        const buffer = fs.readFileSync(__dirname + '\\upload\\' + qrcode.name);
        jimp.read(buffer, function(err, image) {
            if (err) {
                return res.render('auth', {username, invalid: true});
            }
    
            let qrcode = new qreader();
            qrcode.callback = function(err, value) {
                if (err) {
                    return res.render('auth', {username, invalid: true});
                }
    
                // Pass value.result to DB
                db.checkHash(username, (err, row) => {
                    if (err) {
                        return res.render('auth', {username, invalid: true});
                    }

                    if (row.hash !== value.result) {
                        res.render('auth', {username, invalid: true});
                    } else {
                        res.render('profile', {username});
                    }
                })
            };
            // Decoding the QR code
            qrcode.decode(image.bitmap);
        });
    });
});

app.post('/register', (req, res) => {
    const {username, email, password} = req.body;
    const hash = cu.getStringHash(username + cu.generateSalt() + password);
    qr.toFile(`qrcodes/${username}.png`, hash, (err) => {
        if (err) {
            console.log(`Unable to create QR ${username}.png`);
        }
    });

    db.saveUser(username, email, password, hash, (err, row) => {
        res.render('signup', {complete: true});
        mailer.sendQR(username, email);
    });
});

app.post('/passwords', (req, res) => {
    const {username, password} = req.body;
    db.newPassword(username, password);
});

app.get('/users/:username', (req, res) => {
    const { username } = req.params;
    db.getEmailPassword(username, (err, row) => {
        if (row) {
            return res.json({taken: true});
        }
        res.json({taken: false});
    });
});

app.get('/mails/:email', (req, res) => {
    const { email } = req.params;
    db.checkEmail(email, (err, row) => {
        if (row) {
            return res.json({registered: true});
        }
        res.json({registered: false});
    });
})

app.listen(3000, () => console.log(`Application started at http://localhost:3000`));
