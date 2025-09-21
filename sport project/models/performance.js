const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  height: Number,
  weight: Number,
  speed: Number,
  stamina: Number,
  accuracy: Number,
});

module.exports = mongoose.model("Performance", performanceSchema);
