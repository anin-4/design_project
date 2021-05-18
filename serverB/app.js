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
  // const name = "santosh";
  // const amount = 200;
  // const newUser = new User({ transactionID, name, amount });
  // newUser.save();
  const user = await User.findOne({ transactionID });
  user.amount = 500;
  await user.save();
  res.json(user);
});

app.listen(4000, () => {
  console.log("server b is running in 4000");
});
