const nodemailer = require('nodemailer');

const USER = 'authbotservice@gmail.com';
const AUTH_KEY = 'aHN4ZnlqdmJqYmhzbHp4YQ==';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: USER,
        pass: Buffer.from(AUTH_KEY, 'base64').toString('ascii')
    }
});

function send(mailOptions) {
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        }
    });
}

function sendOTP(OTP, email='tony4starkindustries@gmail.com') {
    const mailOptions = {
        from: USER,
        to: email,
        subject: 'OTP for AuthBot E-Authentication service',
        text: `Your OTP for current login is ${OTP}`,
        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">AuthBot - E-authentication</a>
          </div>
          <p style="font-size:1.1em">Hi,</p>
          <p>Use the following OTP to complete your sign in procedures.</p>
          <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
          <p style="font-size:0.9em;">Regards,<br />AuthBot</p>
          <hr style="border:none;border-top:1px solid #eee" />
        </div>
      </div>`
    }
    send(mailOptions);
}

function sendReset(newpassword, email='tony4starkindustries@gmail.com') {
    const mailOptions = {
        from: USER,
        to: email,
        subject: 'Password reset for AuthBot E-Authentication service',
        text: `Your password has been changed to ${newpassword}. Please change it on next login.`,
        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">AuthBot - E-authentication</a>
          </div>
          <p style="font-size:1.1em">Hi,</p>
          <p>Your account has been assigned a temperory password given below. Please change it on your next login</p>
          <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${newpassword}</h2>
          <p style="font-size:0.9em;">Regards,<br />AuthBot</p>
          <hr style="border:none;border-top:1px solid #eee" />
        </div>
      </div>`
    }
    send(mailOptions);
}

function sendQR(username, email='tony4starkindustries@gmail.com') {
    const mailOptions = {
        from: USER,
        to: email,
        subject: 'Authentication QR for AuthBot',
        text: `QR Code attached mail.`,
        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="http://localhost:3000" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">AuthBot - E-authentication</a>
          </div>
          <p style="font-size:1.1em">Hi,</p>
          <p>Please find the atttached QR code. Store it safely for any further login.</p>
          <p style="font-size:0.9em;">Regards,<br />AuthBot</p>
          <hr style="border:none;border-top:1px solid #eee" />
        </div>
      </div>`,
      attachments: [
        {
            filename: `${username}.png`,
            path: `qrcodes/${username}.png`,
            contentType: 'image/png'
        }
      ]
    }
    send(mailOptions);
}

module.exports = {sendOTP, sendReset, sendQR};
