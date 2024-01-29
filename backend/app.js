const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Thing = require("./models/Thing");

const app = express();

mongoose
  .connect(
    "mongodb+srv://lywen:test@cluster0.tpbqupg.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());
// on utilise express.json pour transformer le corps de la requête en objet JS utilisable. Il est possible d'utiliser bodyparser mais il est inclus dans express depuis la version 4.16.0

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // * = tout le monde peut accéder à l'API
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  // on donne l'autorisation d'utiliser certains headers
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  // on donne l'autorisation d'utiliser certaines méthodes
  next();
});

app.post("/api/stuff", (req, res, next) => {
  delete req.body._id;
  const thing = new Thing({
    //L'utilisation de new avec un modèle Mongoose crée par défaut un champ _id avec un identifiant unique généré automatiquement.
    ...req.body,
  });
  thing
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
});

app.put("/api/stuff/:id", (req, res, next) => {
  Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    // Nous sommes obligés de réattribuer _id car sinon nous tenterions de modifier un champ immuable dans un document de la BDD. Nous devons donc utiliser le paremètre id de la requête pour configurer notre Thing avec le même _id qu'avant.
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
});

app.delete("/api/stuff/:id", (req, res, next) => {
  Thing.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
});

app.get("/api/stuff/:id", (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then((thing) => res.status(200).json(thing))
    .catch((error) => res.status(404).json({ error }));
});

app.get("/api/stuff", (req, res, next) => {
  Thing.find()
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(400).json({ error }));
});

module.exports = app;
