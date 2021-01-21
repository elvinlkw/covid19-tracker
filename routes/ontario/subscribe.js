const express = require('express');
const { check, validationResult } = require('express-validator');
require('dotenv').config();
const router = express.Router();
const User = require('../../models/User');

// @route   GET /api/ontario/subscription
// @desc    Get all subscribed emails
// @access  Public
router.get('/', async (req, res) => {
  try {
    const apikey = req.query.apikey;
    if(!apikey === null || apikey !== process.env.API_KEY) {
      return res.status(403).json({ msg: "You need to provide a valid api key" });
    }
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    return res.status(500).send('Server Errror');
  }
});

// @route   POST /api/ontario/subscription
// @desc    Subscribe a new email
// @access  Public
router.post('/', [
  check('email', 'You need to enter a valid email').isEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    let user = await User.findOne({ email: email });
    
    if(user) {
      return res.status(400).json({ errors: [{ msg: 'This email is already subscribed' }] });
    }

    user = new User({ email });
    await user.save();

    return res.json(user);
  } catch (error) {
    return res.status(500).send('Server Errror');
  }
});

// @route   DELETE /api/ontario/subscription
// @desc    Remove a subscriber
// @access  Public
router.delete('/', [
  check('email', 'You need to enter a valid email').isEmail(),
  check('email', 'Email is a required field').not().isEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // const apikey = req.query.apikey;
    // if(!apikey || apikey !== process.env.DELETE_KEY) {
    //   return res.status(403)
    // }

    const { email } = req.body;
    let user = await User.findOne({ email: email });
    console.log(user);
    
    if(!user) {
      return res.status(400).json({ errors: [{ msg: 'This email is not a subscriber' }] });
    }

    await user.remove();

    return res.json({ msg: 'Successfully Removed' });
  } catch (error) {
    return res.status(500).send('Server Errror');
  }
});


module.exports = router;