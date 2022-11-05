const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/users');

router.get('/register', (req, res) => {
  //  res.render('users/register');
});

router.post('/register', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const username = email;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            res.send("Register & login Successful")
          //  res.redirect('/mobile');
        })
    } catch (e) {
        res.send(e);
       // res.redirect('register');
    }
});

router.get('/login', (req, res) => {
   // res.render('users/login');
})

router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.send("Login Succesful")
  });

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.send("Good bye")
    });
  });

module.exports = router;