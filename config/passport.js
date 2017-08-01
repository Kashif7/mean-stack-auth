const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    mongoose = require('mongoose'),
    Auth = mongoose.model('Auth');

passport.use(new LocalStrategy({
    usernameField: 'email'
},
    (email, password, done) => {
        Auth.findOne({ email: email }).then(user => {
            if (user == null) {
                return done(null, false, {
                    message: 'User not found'
                });
            } else if (!user.checkPassword(password)) {
                return done(null, false, {
                    message: 'Incorrect Password'
                });
            } else {
                return done(null, user);
            }
        }).catch(err => {
            return done(err);
        });
    }
));

 passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

passport.use(new FacebookStrategy({

    // pull in our app id and secret from our auth.js file
    clientID: '120434055252488',
    clientSecret: '29e91134f1945f17a4ba79e22f76c874',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'

},

    // facebook will send back the token and profile
    function (token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function () {

            // find the user in the database based on their facebook id
            Auth.findOne({ 'facebook.id': profile.id }, function (err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser = new Auth();

                    // set all of the facebook information in our user model
                    newUser.facebook.id = profile.id; // set the users facebook id                   
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                    newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    //newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                    // save our user to the database
                    newUser.save(function (err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
        });

    }));
