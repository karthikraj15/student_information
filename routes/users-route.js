const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/users');
const catchAsync = require('../utils/catchAsync');

// router.get('/register', (req, res) => {
//     res.render('users/register');
// });

// router.post('/register', catchAsync(async (req, res, next) => {
//     try {
//         const { email, password } = req.body;
//         const user = new User({ email, username:email });
//         const registeredUser = await User.register(user, password);
//         req.login(registeredUser, err => {
//             if (err) return next(err);
//             console.log("Register & login Successful")
//             res.redirect('/students');
//         })
//     } catch (e) {
//         console.log(e.message);
//         res.redirect('register');
//     }
// }));


// router.post('/login', 
//   passport.authenticate('local', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.status(200).json("Login Succesful")
//     // const redirectUrl = req.session.returnTo || '/students';
//     // delete req.session.returnTo;
//     // res.redirect(redirectUrl);
//   });


router.get('/login', (req, res) => {
  // res.render('users/login');
})


router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err); 
    }
    if (! user) {
     return res.status(500).json("Invalid credentials")
    }
    req.login(user, function(err){
      if(err){
        return next(err);
      }
      return res.status(200).json("Login Succesful")        
    });
  })(req, res, next);
});


router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.status(200).json("Good bye,logged out")
     // res.redirect("/login")
    });
  });

module.exports = router;