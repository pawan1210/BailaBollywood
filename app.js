const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('./models/user');
const flash = require("connect-flash");
const nodemailer = require("nodemailer");
const cookieParser = require("cookie-parser");
const passportSetup = require('./config/passport_setup');
const keys = require("./config/keys");
const feed = require('rss-to-json');
const middleware = require('./middleware/index');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const Promise = require('promise');
const port =  3000;



app.use(bodyParser.urlencoded({ extended: true }));

app.use(require('express-session')({
  secret: keys.session.cookieKey,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());


// set view engine
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));



app.use(function (req, res, next) {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.currentUser = req.user;
  next();
});

var MongoURI = "mongodb+srv://pawan:ps199912@cluster0-y6m1y.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(MongoURI, { useUnifiedTopology: true, useNewUrlParser: true });








var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bailabollywood20@gmail.com",
    pass: 'Bailabollywood@20'
  }
});
var mailOptions = {
  from: 'bailabollywood20@gmail.com',
  to: "",
  subject: "bailaBollywood-Thanks for Registration",
  text: "",
  html: '<img src="cid:batman" /> <br><h3>Bienvenido a la familia de  Bailabollywood. Te invitamos a explorar el mundo mágico de la India a através de sus bailes, músicas y la cultura colorida.<h3/><br>',
  attachments: [{
    filename: 'foremail.png',
    path: process.cwd() + '/foremail.png',
    cid: "batman"
  }],
};

var mailOptions2 = {
  from: 'bailabollywood20@gmail.com',
  to: "bailabollywood20@gmail.com",
  subject: " ",
  text: "",
};

var mailOptions3 = {
  from: 'bailabollywood20@gmail.com',
  to: "",
  subject: "BailaBollywood-Account Password",
  html: "<h3>Your Account Password is</h3>"
};

app.get("/someKeyword/:username/:password/:email", (req, res) => {
  res.json({ message: "It works" });
});

app.get("/", function (req, res) {
  feed.load("https://medium.com/feed/@bailabollywood20", (err, rss) => {

    if (err) {
      res.redirect("/");
    }
    else {
      rss.items.forEach((item) => {
        var str = (item.content_encoded);
        var output = "";
        var n = str.indexOf("img");
        str = str.substring(n + 16);
        for (var i = 0; i < str.length; i++) {
          if (str[i] == '"') {
            break;
          }
          output += str[i];
        }
        item["imgUrl"] = output;

      });
      console.log(rss);
      res.render("landing", { blogs: rss });
    }
  });
});

app.get("/register",middleware.isLoggedIn1, function (req, res) {
  res.render("register");
});

app.get("/dashboard",middleware.isLoggedIn, function (req, res) {

  res.render("dashboard");
});


app.post("/register", function (req, res) {
  console.log(req.body + "**");


  var newUser = new User({
    username: req.body.username,
    password: req.body.password,
    email: "",

  });
  var flag = 1;

  User.findOne({ username: req.body.username }).then((user) => {
    if (user == null) {
      User.findOne({ email: req.body.email }).then((user) => {
        if (user == null) {
          newUser.email = req.body.email;
          newUser.save().then((temp) => {
            if (temp) {
              console.log("User Created");
            }
            else {
              console.log("Error");
            }
          });
          console.log(newUser);
          mailOptions.to = req.body.email;
          transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
              console.log(err);
            } else {
              console.log("mail sent" + info.response);
            }
          });


          req.flash("success", "Successfully Registered");
          res.redirect("/login");
        } else {
          req.flash("error", "User already exists");
          res.redirect("/register");
        }
      });

    } else {
      req.flash("error", "User already exists");
      res.redirect("/register");
    }
  });



});


app.post("/contact-us", (req, res) => {
  mailOptions2.subject = req.body.email+" "+req.body.subject ;
  mailOptions2.text = req.body.text;
  transporter.sendMail(mailOptions2, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("mail sent" + info.response);
      res.redirect(req.get('referer'));
    }
  });
});

app.get("/login", middleware.isLoggedIn1, function (req, res) {
  res.render("login");
});

app.post("/login", passport.authenticate('local', {
  failureRedirect: "/login"
}), function (req, res) {
  console.log(req.user.username);
  req.flash("success", "Welcome to BailaBollywood " + req.user.username);
  res.redirect("/dashboard");
});

app.get("/login/forgotPassword", middleware.isLoggedIn1, function (req, res) {
  res.render("password");
});

app.post("/login/forgotPassword", function (req, res) {
  mailOptions3.to = req.body.email;
  User.findOne({ email: req.body.email, username: req.body.username }).then((user) => {
    if (user) {
      mailOptions3.html += "<h3>" + user.password + "</h3>";
      transporter.sendMail(mailOptions3, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          req.flash("success", "Password has been sent to the provided mail-id");
          res.redirect("/login");
        }
      });
    } else {
      req.flash("error", "Username and Password doesn't match");
      res.redirect("/login/forgotPassword");
    }
  });
});

app.get("/logout",middleware.isLoggedIn, function (req, res) {
  req.logout();
  res.redirect("/");
});


app.get("/auth/google", passport.authenticate("google", {
  scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
}));


//callback route for google to redirect to

app.get("/auth/google/redirect", passport.authenticate('google', {
  failureRedirect: "/"
}), (req, res) => {
  console.log(req.user);
  req.flash("success", "Welcome to BailaBollywood " + req.user.username);
  res.redirect("/dashboard");
});

//Facebook Login

app.get("/auth/facebook", passport.authenticate("facebook", {
  scope: ['public_profile', 'email']
}));


//callback route for google to redirect to

app.get("/auth/facebook/redirect", passport.authenticate('facebook', {
  failureRedirect: "/"
}), (req, res) => {
  console.log(req.user);
  req.flash("success", "Welcome to BailaBollywood " + req.user.username);
  res.redirect("/dashboard");
});



app.listen(port, err => {
  if (err) {
    throw err;
  }
  console.log(`App is ready on port :${port}`)
});
