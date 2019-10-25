const express = require('express');
const app = express();
const userRoutes = express.Router();

const ctrlUser = require('../controllers/user.controller');

// Require user model in our routes module
const User = require('../models/user.model');

userRoutes.post('/register', ctrlUser.register);
userRoutes.get('/verify-account/:id', ctrlUser.verify);
userRoutes.post('/login',ctrlUser.sessionChecker, ctrlUser.authenticate);
userRoutes.post('/logout', ctrlUser.logout);

userRoutes.post('/reset-password', ctrlUser.resetPassword);
userRoutes.post('/new-password', ctrlUser.newPassword);

module.exports = userRoutes;
