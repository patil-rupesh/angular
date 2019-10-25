const shortid = require('shortid');

module.exports.generateId = () => {
    return shortid.generate();
}