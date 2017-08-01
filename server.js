const express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    passport = require('passport'),
    app = express();

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: 'false' }));
app.use(cookieParser());
app.use(passport.initialize());

//static file prefixes    
app.use('/', express.static(__dirname));
app.use('/', express.static(__dirname + '/public'));
app.use('/', express.static(__dirname + '/modules'));
app.use('/', express.static(__dirname + '/bower_components'));
app.use('/', express.static(__dirname + '/node_modules'));

//connect to db
mongoose.connect('mongodb://localhost/auth');

//models
require('./modules/auth/server/auth.model');

//controllers
require('./modules/auth/server/auth.controller');

//routes
const authRouter = require('./modules/auth/server/auth.route');

//config
require('./config/passport.js');

app.use('/auth', authRouter);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

// handle the callback after facebook has authenticated the user
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/'
    }));

app.listen(3000, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log("running on port 3000");
    }
});