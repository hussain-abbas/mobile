// user.route.js

const express = require("express");
const app = express();
const userRoutes = express.Router();

let User = require("../models/user");

// user register
userRoutes.route("/add").post(function(req, res) {
  let user = new User(req.body);
  user
    .save()
    .then(user => {
      res.status(200).json({ user: "user in added successfully" });
    })
    .catch(err => {
      if (err.message.indexOf("duplicate key error") !== -1)
        res.status(403).send("user already exists");
      else res.status(400).send("unable to save to database");
    });
});

// user login
userRoutes.route("/login").post(function(req, res) {
  User.find({ email: req.body.email, password: req.body.password }, function(
    err,
    user
  ) {
    if (err) res.status(401).send("user name or password is wrong");
    if (user.length != 0) res.status(200).json({ user: user[0] });
    else res.status(401).send("user name or password is wrong");
  });
});

// Defined get data(index or listing) route
userRoutes.route("/").get(function(req, res) {
  Business.find(function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.json(users);
    }
  });
});

module.exports = userRoutes;
