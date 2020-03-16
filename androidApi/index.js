const express = require('express');
const app = express();
const User = require('../models/user');
const router = express.Router();

router.get("/andApi/", (req, res) => {
    //console.log(req.query);
    console.log(req.query);
    if (req.query.type == 'signin') {
        console.log("asgsag");
        User.findOne({ username: req.query.username }).then((user) => {
            if (user != null) {

                if (user.password === req.query.password) {
                    console.log("password matched");
                    return res.json({ login: true });
                }
                else {
                    console.log("password not matched");
                    return res.json({ login: false });
                }
            }
            else {
                console.log("User not found");
                return res.json({ login: false });
            }
        });
    }
    else if (req.query.type == 'signup') {
        var newUser = {
            username: req.query.username,
            password: req.query.password,
            email: req.query.email
        }
        User.findOne({ username: req.query.username }).then((user) => {
            if (user == null) {
                User.findOne({ email: req.query.email }).then((user) => {
                    if (user == null) {
                        console.log("User added");
                        newUser.save();
                        return res.json({ signup: true });
                    }
                    else {
                        console.log("Email already present");
                        return res.json({ signup: false });
                    }
                })
            }
            else {
                console.log("Username already present");
                return res.json({ signup: false });
            }
        });
    }
    else if (req.query.type == 'google') {
        var newUser = {
            email: req.query.email
        };
        User.findOne({ email: req.query.email }).then((user) => {
            if (user == null) {
                newUser.save();
                res.json({ google: true });
            }
            else {
                res.json({ google: false });
            }
        });
    }
    else if (req.query.type == 'facebook') {
        var newUser = {
            username: req.query.username,
            fbId: req.query.fbId
        };
        User.findOne({ fbId: req.query.fbId }).then((user) => {
            if (user == null) {
                newUser.save();
                res.json({ facebook: true });
            }
            else {
                res.json({ facebook: false });
            }
        })
    }

});


module.exports = router;
