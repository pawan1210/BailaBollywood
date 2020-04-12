var middlewareObj = {};

//Middleware
middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middlewareObj.isLoggedIn1 = function (req, res, next) {
    if (req.user) {
        return res.redirect("/");
    }
    next();
}


module.exports = middlewareObj;
