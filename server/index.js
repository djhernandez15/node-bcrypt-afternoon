require("dotenv").config();
const express = require("express");
const app = express();
//require massive to connect to DB
const massive = require("massive");
//require express-session to create sessions and sessions store
const session = require("express-session");
//require controllers/authController and controllers/treasureController to use methods that dictate how to handle a request and response
const ac = require("./controllers/authController");
const tc = require("./controllers/treasureController");
const auth = require("./middleware/authMiddleware");
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
//Endpoints- Login/Logout functions
//endpoint for registering user
app.post("/auth/register", ac.register);
//endpoint for logging in
app.post("/auth/login", ac.login);
//endpoint to get user info and logout
app.get("/auth/logout", ac.logout);

//Endpoints- Get dragon treasures
app.get("/api/treasure/dragon", tc.dragonTreasure);
app.get("/api/treasure/user", auth.usersOnly, tc.getUserTreasure);
app.post("/api/treasure/user", auth.usersOnly, tc.addUserTreasure);
app.get(
  "/api/treasure/all",
  auth.usersOnly,
  auth.adminsOnly,
  tc.getAllTreasure
);

//Make sure server is listening
app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));
