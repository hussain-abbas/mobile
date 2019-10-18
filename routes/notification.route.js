// contacts .route.js

const express = require("express");
const app = express();
const contactsRoutes = express.Router();
const connection = require("../realtime");

// Require Contacts model in our routes module
let Contacts = require("../models/Contacts");

// Defined store route
contactsRoutes.route("/add").post(function (req, res) {
  let contacts = new Contacts(req.body);
  contacts
    .save()
    .then(contacts => {
      res
        .status(200)
        .json({ contacts: "contactsin added successfully" });

      const con = connection.connection();
      if (con.getUser() === contacts.email)
        con.sendEvent("added", contacts);
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

// Defined store route
contactsRoutes.route("/adds").post(function (req, res) {
  const lotOfContacts = req.body;
  console.log(lotOfContacts)
  Promise.all(lotOfContacts.map( (contacts) => {
    let contact = new Contacts(contacts);
    return contact
      .save().then(() => {
        console.log(`Saved`);
      }).catch(err => {
        res.status(400).send("unable to save to database");
      });
  }))
    .then(() => {
      res
        .status(200)
        .json({ contacts: "contacts added successfully" });
    })
});

//  Defined update route
contactsRoutes.route("/:query").get(function (req, res) {
  const searchQuery = req.params.query

  var phoneno = /^\+?([0-9])+$/;
  if (searchQuery.match(phoneno)) {
    Contacts.find({ number: searchQuery }, function (err, contactss) {
      if (!contactss) res.status(404).send("no document found");
      else {
        res.status(200).send([contactss]);
      }
    });
    return ;
  }

  let searchArray = []
  if (searchQuery) searchArray = searchQuery.replace(' ', '').split(',');
  else res.status(404).send("no document found");
  console.log(searchArray)
  Contacts.find({
    'name': {
      $in: searchArray
    }
  }, function (err, contactss) {
    if (!contactss) res.status(404).send("no document found");
    else {
      res.status(200).send(contactss);
    }
  });

});



// Defined get data(index or listing) route
contactsRoutes.route("/").get(function (req, res) {
  Contacts.find(function (err, contactss) {
    if (err) {
      console.log(err);
    } else {
      res.json(contactss);
    }
  });
});

// Defined edit route
contactsRoutes.route("/edit/:id").get(function (req, res) {
  let id = req.params.id;
  Contacts.findById(id, function (err, contacts) {
    res.json(contacts);
  });
});

//  Defined update route
contactsRoutes.route("/:email").get(function (req, res) {
  Contacts.find({ email: req.params.email }, function (err, contactss) {
    if (!contactss) res.status(404).send("no document found");
    else {
      res.status(200).send(contactss);
    }
  });
});

//  Defined update route
contactsRoutes.route("/update/:id").post(function (req, res) {
  Contacts.findById(req.params.id, function (err, contacts) {
    if (!contacts) res.status(400).send("no document found");
    else {
      if (req.body.title) contacts.title = req.body.title;
      if (req.body.body) contacts.body = req.body.body;
      if (req.body.kind) contacts.kind = req.body.kind;

      contacts
        .save()
        .then(contacts => {
          res.status(200).send("update the database");
        })
        .catch(err => {
          console.log("in error", err);
          res.status(400).send("unable to update the database");
        });
    }
  });
});

// Defined delete | remove | destroy route
contactsRoutes.route("/delete/:id").get(function (req, res) {
  Contacts.findByIdAndRemove({ _id: req.params.id }, function (
    err,
    contacts
  ) {
    if (err) res.json(err);
    else res.json("Successfully removed");
  });
});

module.exports = contactsRoutes;
// module.exports = function(io) {
//   this.io = io;
// };
