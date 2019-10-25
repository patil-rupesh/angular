const mongoose = require('mongoose');
const util = require('../utils/util');
const Schema = mongoose.Schema;

// Define collection and schema for user
const client = new Schema({
  clientname: {
    type: String,
    required: 'client name can\'t be empty'
  },
  clientid: {
    type: String
  },
  clientsecret: {
    type: String
  },
  redirectURL: {
    type: String,
    required: 'redirectURL can\'t be empty'
  }
});

client.pre('save', function (next) {
    this.clientid = util.generateId();
    this.clientsecret = util.generateId();
    next();
});

module.exports = mongoose.model('Client', client);