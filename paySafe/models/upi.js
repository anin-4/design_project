const mongoose = require("mongoose");
const { Schema } = mongoose;

const upiSchema = new Schema({
  upi: {
    type: String,
    required: true,
  },
  User: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Upi", upiSchema);
