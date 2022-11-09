const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/users');
const catchAsync = require('../utils/catchAsync');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = new User({ email, username:email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            console.log("Register & login Successful")
            res.redirect('/students');
        })
    } catch (e) {
        console.log(e.message);
        res.redirect('register');
    }
}));

router.get('/login', (req, res) => {
   res.render('users/login');
})

router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    console.log("Login Succesful")
    const redirectUrl = req.session.returnTo || '/students';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  });

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      console.log("Good bye")
      res.redirect("/login")
    });
  });

module.exports = router;