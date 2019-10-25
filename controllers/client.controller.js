const mongoose = require('mongoose');
const Client = mongoose.model('Client');
const util = require('../utils/util')

module.exports.register = (req, res, next) => {
    var client = new Client();
    console.log(req.body);
    client.clientname = req.body.clientname;
    client.redirectURL = req.body.redirectURL;
    client.save((err, doc) => {
        if (!err) {
            res.status(200).json({ msg: "Successful Client registration", id: doc.clientid, secret: doc.clientsecret });
        }
        else {
            return next(err);
        }

    });
}

module.exports.getAll = (req, res, next) => {
    Client.find()
        .then(doc => {
            console.log(doc);
            res.json(doc)
        })
        .catch(err => {
            console.error(err)
        });
}

module.exports.updateSecret = (req, res, next) => {
    console.log(req.params.id);
    Client.findOneAndUpdate(
        {
            clientid: req.params.id  // search query
        },
        {
            clientsecret: util.generateId()  // field:values to update
        },
        {
            new: true,                       // return updated doc
            runValidators: true              // validate before update
        },
        function (err, doc) {
            if (!err) return res.status(200).json({ msg: doc });
            return res.status(200).json({ msg: err });
        });
}

module.exports.delete = (req, res, next) => {
    console.log(req.params.id);
    Client.findOneAndDelete({
        clientid: req.params.id
    })
        .then(doc => {
            if (doc == null) res.status(200).json({ msg: "No client exist with given id" });
            else res.status(200).json({ msg: doc });
        })
        .catch(err => {
            res.status(200).json({ err: err });
        })
}
