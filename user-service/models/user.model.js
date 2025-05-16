const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  preferences: {
    type: [String], // tableau de genres ou préférences par ex.
    default: []
  }
});

module.exports = mongoose.model('User', userSchema);
