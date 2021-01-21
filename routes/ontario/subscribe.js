const express = require('express');
require('dotenv').config();
const router = express.Router();
const User = require('../../models/User');

// @route   GET /api/ontario/subscription
// @desc    Get all subscribed emails
// @access  Public
router.get('/', async (req, res) => {
  try {
    const apikey = req.querey.apikey;
    if(apikey === null || apikey !== process.env.API_KEY) {
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
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email: email });
    
    if(user) {
      res.status(400).json({ msg: "This email is already subscribed" });
    }

    user = new User({ email });
    await user.save();

    return res.json(user);
  } catch (error) {
    res.status(500).send('Server Errror');
  }
});

module.exports = router;