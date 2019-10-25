const express = require('express');
const app = express();
const clientRoutes = express.Router();

const ctrlClient = require('../controllers/client.controller');

clientRoutes.post('/register', ctrlClient.register);
clientRoutes.get('/getall', ctrlClient.getAll);
clientRoutes.get('/update/:id', ctrlClient.updateSecret);
clientRoutes.get('/delete/:id', ctrlClient.delete);

module.exports = clientRoutes;