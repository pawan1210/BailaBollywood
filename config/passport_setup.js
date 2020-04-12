const express = require('express');
const app = express();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const FacebookStrategy = require("passport-facebook");
const keys = require("./keys");
const User = require("../models/user");
const localStrategy = require('passport-local').Strategy;


//initialize passport and use passport for login and signup


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});


passport.use('local',
    new localStrategy(
        {
            usernameField: "username"
        },
        (username, password, done) => {
            User.findOne({ username: username }, (err, user) => {
                if (err) {
                    console.log("error in finding user" + err);
                    return done(err);
                }
                if (!user || user.password != password) {
                    console.log("invalid username/password");
                    return done(null, false);
                }
                return done(null, user);
            });
        }
    )
);

passport.use(new GoogleStrategy({
    // options for google stratrgy.

    callbackURL: "https://bailabollywood.com/auth/google/redirect",
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret

}, (accessToken, refreshToken, profile, done) => {
    //callback function for passport.

    // check if user already exists in the db.
    User.findOne({ email: profile.emails[0].value }).then((currentUser) => {
        if (currentUser) {
            // already have the user.
            console.log("User already exists");
            done(null, currentUser);
        } else {
            // create new User.
            new User({
                username: profile.displayName,
                email: profile.emails[0].value
            }).save().then((newUser => {
                console.log(newUser);
                done(null, newUser);
            }));
        }

    });
}));


passport.use(new FacebookStrategy({
    // options for google stratrgy.

    callbackURL: "https://bailabollywood.com/auth/facebook/redirect",
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret

}, (accessToken, refreshToken, profile, done) => {
    //callback function for passport.
    console.log(profile);
    // check if user already exists in the db.
    User.findOne({ fbId: profile.id }).then((currentUser) => {
        if (currentUser) {
            // already have the user.
            console.log("User already exists");
            done(null, currentUser);
        } else {
            // create new User.
            new User({
                username: profile.displayName,
                fbId: profile.id
            }).save().then((newUser => {
                console.log(newUser);
                done(null, newUser);
            }));
        }

    });
}));
