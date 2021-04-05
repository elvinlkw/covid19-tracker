const emailBody = ({ date, confirmed, deaths, tests_completed, percent_positive, total, email, token }) => (
  `<div style="font-family:Arial, Helvetica, sans-serif;position:relative;min-height:100vh;width:100%;background-color:#000;margin:0;">
    <div style="width:80%;height:100vh;margin:0 auto;border:1px solid #000;background-color:#fff;">
      <div style="width:80%;margin:0 auto;">
        <h1 style="text-align:center">Ontario Daily Covid19 Summary</h1>
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
          <span style="margin-right:0.25rem">To Unsubscribe</span><a href="https://elikamwa-covid19-tracker.herokuapp.com/unsubscribe?email=${email}&token=${token}" target="_blank">Click Here</a>
        </div>
      </div>
    </div>
  </div>`
)

module.exports = emailBody;