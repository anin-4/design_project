const mongoose = require("mongoose");
const { Schema } = mongoose;

const User = new Schema({
  name: String,
  transactionID: String,
  amount: Number,
});

module.exports = mongoose.model("User", User);
