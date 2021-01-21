const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = User = mongoose.model('User', userSchema);