module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        res.status(401).json("You must be signed in first")
      //  return res.redirect('/login');
    }
    next();
}