const passport = require('passport'),
    mongoose = require('mongoose'),
    Auth = mongoose.model('Auth');

module.exports.Register = (req, res) => {
    console.log(req.body);
    let user = new Auth(req.body);
    user.setPassword(req.body.password);

    user.save().then(() => {
        let token = user.generateJwt();
        res.status(200).json(token);
    }).catch(err => {
        console.log(err);
        res.status(401).json(err);
    });
}

module.exports.Login = (req, res) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            res.status(404).json(err);
        } else if (user) {
            let token = user.generateJwt();
            res.status(200).json(token);
        } else {
            res.status(401).json(info);
        }
    });
}