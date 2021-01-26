const express = require('express');
const { check, validationResult } = require('express-validator');
require('dotenv').config();
const nodemailer = require('nodemailer');
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

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    const msg = {
      from: '"Covid-19 Alert" <elvinlikamwa@gmail.com>', // sender address
      to: email, // list of receivers
      subject: `Daily Covid19 Cases Update - Subscription Alert`, // Subject line
      html: `
      <div style="font-family:Arial, Helvetica, sans-serif;position:relative;min-height:100vh;width:100%;background-color:#000;margin:0;">
        <div style="width:80%;height:100vh;margin:0 auto;border:1px solid #000;background-color:#fff;">
          <div style="width:80%;margin:0 auto;">
            <h1 style="text-align:center">Ontario Daily Covid19 Summary</h1>
          </div>
          <hr style="border-color:#e2dede;"/>
          <h2 style="text-align: center;background-color: #b1afaf; color:#000; padding:2rem;">Welcome to the Ontario Covid19 Tracker Subscription List</h2>
          <h2 style="text-align: center;margin-bottom:5rem">You will receive daily emails on the confirmed cases of covid19 right to your email.</h2>
        </div>
      </div>
      `, // html body
    }

    // send mail with defined transport object
    let info = await transporter.sendMail(msg);

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...


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
    
    if(!user) {
      return res.status(400).json({ errors: [{ msg: 'This email is not a subscriber' }] });
    }

    await user.remove();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    const msg = {
      from: '"Covid-19 Alert" <elvinlkw@hotmail.com>', // sender address
      to: email, // list of receivers
      subject: `Daily Covid19 Cases Update - Unsubscription Alert`, // Subject line
      html: `
      <div style="font-family:Arial, Helvetica, sans-serif;position:relative;min-height:100vh;width:100%;background-color:#000;margin:0;">
        <div style="width:80%;height:100vh;margin:0 auto;border:1px solid #000;background-color:#fff;">
          <div style="width:80%;margin:0 auto;">
            <h1 style="text-align:center">Ontario Daily Covid19 Summary</h1>
          </div>
          <hr style="border-color:#e2dede;"/>
          <h2 style="text-align: center;background-color: #b1afaf; color:#000; padding:2rem;">You have successfully unsubscribe from our email list</h2>
          <h2 style="text-align: center;margin-bottom:5rem;">You can always sign up for emails again</h2>
        </div>
      </div>
      `, // html body
    }

    // send mail with defined transport object
    let info = await transporter.sendMail(msg);

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    return res.json({ msg: 'Successfully Removed' });
  } catch (error) {
    return res.status(500).send('Server Errror');
  }
});


module.exports = router;