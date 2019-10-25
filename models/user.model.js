const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Define collection and schema for user
let user = new Schema({
  userName: {
    type: String,
    required: 'user name can\'t be empty'
  },
  email: {
    type: String,
    required: 'Email can\'t be empty',
    unique: true
  },
  verifiedAccount: {
    type: Boolean,
    default: false
  },
  firstName: {
    type: String,
    required: 'first name can\'t be empty'
  },
  lastName: {
    type: String,
    required: 'last name can\'t be empty'
  },
  password: {
    type: String,
    required: 'Password can\'t be empty',
    minlength: [4, 'Password must be atleast 4 character long']
  },
  encyCode: String
});

// Custom validation for email
user.path('email').validate((val) => {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(val);
}, 'Invalid e-mail.');

// Events
user.pre('save', function (next) {
  bcrypt.genSalt(10, (err, code) => {
      bcrypt.hash(this.password, code, (err, hash) => {
          this.password = hash;
          this.encyCode = code;
          next();
      });
  });
});


// Methods
user.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

user.methods.isAccountVerified = function () {
  return this.verifiedAccount;
};

module.exports = mongoose.model('User', user);
