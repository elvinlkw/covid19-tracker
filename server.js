const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB
connectDB();

// middleware
app.use(express.json());

// Routes
const ontarioCasesRoute = require('./routes/ontario/cases');
const ontarioSubsRoute = require('./routes/ontario/subscribe');

app.use('/api/ontario', ontarioCasesRoute);
app.use('/api/ontario/subscription', ontarioSubsRoute);

// Scheduler
const startCron = require('./cron/prep_emails');
const startCron2 = require('./cron/prep_emails2');
startCron('20 0 * * *');
startCron2('1 4 * * *');

// Serve static assets in production
if(process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}

app.listen(PORT, () => console.log(`Server Started on Port: ${PORT}`));