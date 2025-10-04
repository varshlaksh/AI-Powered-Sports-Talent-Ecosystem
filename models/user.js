const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["athlete", "coach", "scout"], required: true },
  sport: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
