const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const router = express.Router();

// Registration Route
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const newUser = new User({ username, email, password });
    await newUser.save();
    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/users/login');
  } catch (err) {
    req.flash('error_msg', 'Something went wrong');
    res.redirect('/users/register');
  }
});
const stripe = require('stripe')('your-stripe-secret-key');
const YOUR_DOMAIN = 'http://localhost:3000';

router.post('/checkout', async (req, res) => {
  const { horseId } = req.body;
  const horse = await Horse.findById(horseId);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: horse.name,
        },
        unit_amount: horse.price * 100,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}/cancel`,
  });

  res.redirect(303, session.url);
});
// Login Route
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}));

// Logout Route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

module.exports = router;
