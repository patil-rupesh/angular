const mongoose = require('mongoose');
const _ = require('lodash');

const mail = require('./mail-service');
const User = mongoose.model('User');

module.exports.register = (req, res, next) => {
    var user = new User();
    user.userName = req.body.userName;
    user.email = req.body.email;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.password = req.body.password;
    user.save((err, doc) => {
        if (!err) {
            res.send("Successful registration");
            mail.sendVerifyAccountMail(doc.email, doc._id);
        }
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }

    });
}

module.exports.verify = (req, res, next) => {
    User.findById(_id = req.params.id, (err, user) => {
        if (err) return res.status(200).json({ success: false, msg: err });
        else if (!user) return res.status(200).json({ success: false, msg: "no user" });
        else if (user.isAccountVerified) return res.status(200).json({ success: false, msg: "Account already verified " });
        else User.findOneAndUpdate(
            {
                _id: req.params.id  // search query
            },
            {
                verifiedAccount: true  // field:values to update
            },
            {
                new: true,                       // return updated doc
                runValidators: true              // validate before update
            },
            function (err, user) {
                if (err) return res.status(200).json({ success: false, msg: err });
                else if (!user) return res.status(200).json({ success: false, msg: "no user" });
                else return res.status(200).json({ success: true, msg: "Account verified " });

            });

    });
}

module.exports.sessionChecker = (req, res, next) => {
    if (req.session.userId && req.cookies.sid) {
        res.status(200).json({ msg: "already login" });
    } else {
        next();
    }
};

module.exports.authenticate = (req, res, next) => {
    console.log(req.session.userId);
    User.findOne({ email: req.body.email },
        (err, user) => {
            if (err)
                return res.status(200).json({ success: false, msg: err });
            // unknown user
            else if (!user)
                return res.status(200).json({ success: false, msg: "Account not registered" });
            //account is not verified
            else if (!user.isAccountVerified())
                return res.status(200).json({ success: false, msg: "Account not verified" });
            // wrong password
            else if (!user.verifyPassword(req.body.password))
                return res.status(200).json({ success: false, msg: "Wrong password." });
            // authentication succeeded
            else {
                req.session.userId = user._id;
                req.session.userName = user.userName;
                console.log(req.session.userId);
                return res.status(200).json({ success: true, msg: req.session });
            }
        });
}

module.exports.logout = (req, res, next) => {
    if (req.session.userId && req.cookies.sid) {
        console.log(req.session.userId);
        req.session.destroy(err => {
            console.log(err);
            if (err) return res.status(200).json(err);
            res.clearCokie("sid");
            return res.status(200).json({ success: true, msg: "Logout Success" });
        });
    }
    else return res.status(200).json({ success: false, msg: "No login exist" });
}

module.exports.resetPassword = (req, res, next) => {
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) return res.status(200).json(err);
        else if (!user) return res.status(200).json({ success: false, msg: "no user found" });
        mail.sendResetPasswordMail(user.email, user._id);
        return res.status(200).json({ success: true, msg: "Password reset link sent to mail" });
    });
}

module.exports.newPassword = (req, res, next) => {

}

module.exports.getId = (req, res, next) => {
    return res.status(200).json(req.session);
}

module.exports.userProfile = (req, res, next) => {
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!err)
                return res.status(404).json({ success: false, message: err });
            else if (!user)
                return res.status(404).json({ success: false, message: 'User record not found.' });
            else
                return res.status(200).json({ success: true, user: _.pick(user, ['userName', 'firstName', 'lastName', 'email']) });
        }
    );
}