const express = require('express'),
    Router = express.Router(),
    AuthController = require('./auth.controller');

Router.post('/register',AuthController.Register);
Router.post('/login',AuthController.Login);

module.exports = Router;