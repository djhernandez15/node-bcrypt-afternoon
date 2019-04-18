require("dotenv").config();
const express = require("express");
const app = express();
//require massive to connect to DB
const massive = require("massive");
//require express-session to create sessions and sessions store
const session = require("express-session");
//require controllers/authController to use methods that dictate how to handle a request and response
const ac = require("./controllers/authController");
const PORT = 4000;
//
const { CONNECTION_STRING, SESSION_SECRET } = process.env;
//use express.json middleware to get access to req.boy
app.use(express.json());
//invoke massive passing in CONNECTION_STRING in the .env file. Then set 'db' to db to use database in requests and responses
massive(CONNECTION_STRING).then(db => {
  app.set("db", db);
  console.log("db connected");
});
//use session middlware and set secret(only required property) to SESSION_SECRET from .env file
app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
  })
);
//Endpoints
app.post("/auth/register", ac.register);
app.post("/auth/register", (req, res) => {
  res.status(200).json(req.session.user);
});
//Make sure server is listening
app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));
