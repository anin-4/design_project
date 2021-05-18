const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const Upi = require("./models/upi");
const fetch = require("node-fetch");

mongoose.connect(
  "mongodb://localhost:27017/paySafe",
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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("public", path.join(__dirname, "public"));

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

const sessionConfig = {
  secret: "somesecret",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionConfig));

app.use(flash());

app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.done = req.flash("done");
  next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  try {
    const { email, username, password, upi } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    const u = new Upi({ upi, User: registeredUser._id });
    await u.save();
    req.flash("success", "you are successfully registered");
    res.redirect("/login");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "you are successfully logged in");
    res.redirect("/paymentPortal");
  }
);

app.get("/paymentPortal", (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "you must be signed in for this service");
    return res.redirect("/login");
  }
  res.render("paymentPortal.ejs");
});

app.post("/paymentPortal", async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "you must be signed in for this service");
    return res.redirect("/login");
  }
  try {
    const { transactionID } = req.body;
    console.log(transactionID);
    const data = { transactionID };
    const response = await fetch("http://localhost:4000/data", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    });
    const insertedData = await response.json();
    // console.log(insertedData);
    // res.redirect("/paymentPortal");
    req.flash("done", `your payment to ${insertedData.name} was successful`);
    res.redirect("/paymentPortal");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/paymentPortal");
  }
});

app.listen(5000, () => {
  console.log("server up and running in 5000");
});
