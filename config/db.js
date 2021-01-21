const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = () => {
  const uri = process.env.MONGO_URI;
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error'));
  db.on('open', () => console.log('MongoDB Connected!'));
}

module.exports = connectDB;