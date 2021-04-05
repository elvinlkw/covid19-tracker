const moment = require('moment');
const request = require('request');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const emailBody = require('./emailBody');

async function getTodaysData() {
  const options = {
    uri: `https://data.ontario.ca/api/3/action/datastore_search?resource_id=ed270bb8-340b-41f9-a7c6-e8ef587e6d11&limit=99999999`,
    method: 'GET',
    headers: { 'user-agent': 'node.js' }
  }

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if(error) console.log(error);

      if(response.statusCode !== 200) {
        console.log('Error');
        reject();
      }
      const res = JSON.parse(body).result.records;
      const last_index = res.length-1;
      // BUILD OBJECT
      const date = moment(res[last_index]["Reported Date"], "YYYY-MM-DD").format("YYYY-MM-DD");
      const total = res[last_index]["Total Cases"];
      const confirmed = res[last_index]["Total Cases"] - res[res.length-2]["Total Cases"];
      const deaths = res[last_index].Deaths - res[last_index-1].Deaths;
      const percent_positive = res[last_index]["Percent positive tests in last day"];
      const tests_completed = res[last_index]["Total tests completed in the last day"];
      const obj = { date, confirmed, deaths, percent_positive, tests_completed, total };
      resolve(obj);
    });
  })
}

async function checkEmailReady() {
  return await new Promise(resolve => {
    console.log('Cron Started');
    const interval = setInterval(async () => {
      const obj = await getTodaysData();
      if (obj.date === moment().format('YYYY-MM-DD')) {
        console.log(obj);
        const { date, confirmed, deaths, tests_completed, percent_positive, total } = obj;
        // Fetch list of users
        const users = await User.find();
        const emailList = users.map(user => user.email);

        // Send Email
        // create reusable transporter object using the default SMTP transport
        // let transporter = nodemailer.createTransport({
        //   host: "smtp.ethereal.email",
        //   port: 587,
        //   secure: false, // true for 465, false for other ports
        //   auth: {
        //     user: 'ronaldo18@ethereal.email', // generated ethereal user
        //     pass: '9ujpG7BdrFn62eF3Np', // generated ethereal password
        //   },
        // });

        // GMAIL
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
          }
        });

        const msg = {
          from: '"No-Reply" <elvinlkw@hotmail.com>', // sender address
          subject: `Daily Covid19 Cases Update - ${date}`, // Subject line
        }

        emailList.forEach(email => {
          // Provide JSON Token
          const payload = {
            user: {
              email
            }
          };

          try {
            // Sign Token
            const token = jwt.sign(payload, process.env.JWTSECRET);

            msg.bcc = email;
            msg.html = emailBody({ date, confirmed, deaths, tests_completed, percent_positive, total, email, token })

            // send mail with defined transport object
            transporter.sendMail(msg, (err, info) => {
              if(err) {
                console.log(`Error Occurred ${err.message}`);
                return process.exit(1);
              }

              console.log(`Message sent: ${info.messageId}`);
              console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
          });
          } catch (error) {
            throw error;
          }
        });
        console.log('Cron Ended');
        resolve();
        clearInterval(interval);
      }
    }, 15000);
  });
}

function startCron(time) {
  // Cron Job that starts everyday at 9:45 AM
  cron.schedule(time, () => {
    checkEmailReady();
  });
}

module.exports = startCron;
