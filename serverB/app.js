const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./user");
mongoose.connect(
  "mongodb://localhost:27017/serverB",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) {
      console.log("MongoDB Connection Succeeded.");
    } else {
      console.log("Error in DB connection: " + err);
    }
  }
);

app.use(cors());
app.use(express.json());

app.post("/data", async (req, res) => {
  const { transactionID } = req.body;
  const user = await User.findOne({ transactionID });
  if (user) {
    let min = user.amount;
    let max = 1000;
    user.amount = Math.floor(Math.random() * (max - min + 1)) + min;
    await user.save();
    res.json(user);
  } else {
    res.json({ status: false });
  }
});

app.listen(4000, () => {
  console.log("server b is running in 4000");
});
