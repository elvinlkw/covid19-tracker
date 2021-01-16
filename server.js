const express = require('express');
const app = express();

const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());

// Routes
const ontarioRoute = require('./routes/ontario');

app.use('/api/ontario', ontarioRoute);

app.listen(PORT, () => console.log(`Server Started on Port: ${PORT}`));