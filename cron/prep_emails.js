const moment = require('moment');
const request = require('request');
const cron = require('node-cron');
const nodemailer = require('nodemailer');

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
      const confirmed = res[last_index]["Total Cases"] - res[res.length-2]["Total Cases"];
      const deaths = res[last_index].Deaths - res[last_index-1].Deaths;
      const percent_positive = res[last_index]["Percent positive tests in last day"];
      const tests_completed = res[last_index]["Total tests completed in the last day"];
      const obj = { date, confirmed, deaths, percent_positive, tests_completed };
      resolve(obj);
    });
  })
}

async function checkEmailReady() {
  return await new Promise(resolve => {
    const interval = setInterval(async () => {
      const obj = await getTodaysData();
      if (obj.date === moment().format('YYYY-MM-DD')) {
        console.log(obj);
        const { date, confirmed, deaths, tests_completed, percent_positive } = obj;

        // Send Email
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: 'laney.okon43@ethereal.email', // generated ethereal user
            pass: 'gyMw3ypkAEQp8uv8rw', // generated ethereal password
          },
        });

        const msg = {
          from: '"No Reply" <elvinlkw@hotmail.com>', // sender address
          to: "elvinlkw@hotmail.com, elvinlkw4@gmail.com", // list of receivers
          subject: `Daily Covid19 Cases Update - ${date}`, // Subject line
          html: `
            <h1>Daily Covid19 Update</h1>
            <p>The number of <strong>confirmed</strong> today in ON is: ${confirmed} cases</p>
            <p>The number of <strong>deaths</strong> today in ON is: ${deaths} cases</p>
            <p>The number of <strong>tests completed</strong> today in ON is: ${tests_completed} tests</p>
            <p>The <strong>percentage positivity</strong> in ON today is: ${percent_positive} %</p>
            <p>Production</p>
            <div style="display:flex;justify-content:center;align-items:center;margin-top:2rem">
              <span style="margin-right:0.25rem">To Unsubscribe</span><a href="https://elikamwa-covid19-tracker.herokuapp.com/unsubscribe" target="blank">Click Here</a>
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
