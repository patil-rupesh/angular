const nodemailer = require('nodemailer');

let transport = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  auth: {
    user: 'rupesh.patil@triconinfotech.com',
    pass: 'Secure@1234'
  }
});

module.exports.sendVerifyAccountMail = (toUser, id) => {

  const message = {
    from: 'rupesh.patil@triconinfotech.com', // Sender address
    to: toUser,         // List of recipients
    subject: 'Verify Account', // Subject line
    html: '<a href="http://localhost:3000/user/verify-account/'+id+'">Verify Account</a>' // Plain text body
  };
  transport.sendMail(message, function (err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
  });
};

module.exports.sendResetPasswordMail = (toUser, id) => {

  const message = {
    from: 'rupesh.patil@triconinfotech.com', // Sender address
    to: toUser,         // List of recipients
    subject: 'Verify Account', // Subject line
    html: '<a href="http://localhost:3000/user/new-password?id='+id+'">Click to reset password</a>' // Plain text body
  };
  transport.sendMail(message, function (err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
  });
};