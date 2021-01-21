const moment = require('moment');
const request = require('request');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const User = require('../models/User');

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
        console.log(emailList)

        // Send Email
        // create reusable transporter object using the default SMTP transport
        // let transporter = nodemailer.createTransport({
        //   host: "smtp.ethereal.email",
        //   port: 587,
        //   secure: false, // true for 465, false for other ports
        //   auth: {
        //     user: 'frances87@ethereal.email', // generated ethereal user
        //     pass: 'k8NtCGqErzDMjfRayH', // generated ethereal password
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
          bcc: emailList, // list of receivers
          subject: `Daily Covid19 Cases Update - ${date}`, // Subject line
          html: `
          <div style="font-family:Arial, Helvetica, sans-serif;position:relative;min-height:100vh;width:100%;background-color:#000;margin:0;">
          <div style="width:80%;height:100vh;margin:0 auto;border:1px solid #000;background-color:#fff;">
            <div style="width:80%;margin:0 auto;">
              <h1 style="text-align:center">Ontario Daily Covid19 Sumary</h1>
              <h3 style="text-align:center">${date}</h3>
            </div>
            <hr style="border-color:#e2dede;"/>
            <div style="width:80%;margin:0 auto;text-align: center;">
              <div>
                <h3>Confirmed Cases (24 hr Period)</h3>
                <p style="font-size:18px">${confirmed}</p>
                <hr style="opacity: 0.2;"/>
              </div>
              <div>
                <h3>Deaths (24 hr Period)</h3>
                <p style="font-size:18px">${deaths}</p>
                <hr style="opacity: 0.2;"/>
              </div>
              <div>
                <h3>Tests Completed (24 hr Period)</h3>
                <p style="font-size:18px">${tests_completed}</p>
                <hr style="opacity: 0.2;"/>
              </div>
              <div>
                <h3>Percentage Positivity</h3>
                <p style="font-size:18px">${percent_positive}</p>
                <hr style="opacity: 0.2;"/>
              </div>
              <div>
                <h3>Total Cases (to date)</h3>
                <p style="font-size:18px">${total}</p>
                <hr style="opacity: 0.2;"/>
              </div>
              <div style="display:flex;justify-content:center;align-items:center;margin-top:8rem">
                <span style="margin-right:0.25rem">To Unsubscribe</span><a href="https://elikamwa-covid19-tracker.herokuapp.com/unsubscribe" target="_blank">Click Here</a>
              </div>
            </div>
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
