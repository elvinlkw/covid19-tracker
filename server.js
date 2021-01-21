const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());

// Routes
const ontarioRoute = require('./routes/ontario');

app.use('/api/ontario', ontarioRoute);

// Scheduler
const startCron = require('./cron/prep_emails');
const startCron2 = require('./cron/prep_emails2');
startCron('26 22 * * *');
startCron2('26 22 * * *');

// Serve static assets in production
if(process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}

app.listen(PORT, () => console.log(`Server Started on Port: ${PORT}`));