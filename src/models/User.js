const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  oauthProvider: { type: String },
  oauthId: { type: String, unique: true },
  role: { type: String, default: 'attendee' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', userSchema);
