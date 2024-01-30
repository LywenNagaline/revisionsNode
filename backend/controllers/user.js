const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10) // on hash le mot de passe mentionné dans le formulaire 10 fois
    .then((hash) => {
      // on récupère le résultat du hash
      const user = new User({
        // on crée un nouvel utilisateur
        email: req.body.email,
        password: hash,
      });
      user
        .save() // on sauvegarde l'utilisateur dans la BDD
        .then(() => res.status(201).json({ message: "Utilisateur créé !" })) // on renvoie une réponse au frontend
        .catch((error) => res.status(400).json({ error })); // on renvoie une erreur au frontend
    })
    .catch((error) => res.status(500).json({ error })); // on renvoie une erreur au frontend
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) // on recherche l'utilisateur dans la BDD
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ error: "Paire identifiant / mot de passe incorrect" });
      } else {
        bcrypt
          .compare(req.body.password, user.password) // on compare le mot de passe mentionné dans le formulaire avec le hash enregistré dans la BDD
          .then((valid) => {
            if (!valid) {
              return res
                .status(401) // 401 = unauthorized
                .json({ error: "Paire identifiant / mot de passe incorrect" }); // on renvoie une erreur au frontend
            } else {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
                  expiresIn: "24h",
                }),
              });
            } // on renvoie l'userId et un token au frontend
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      } // on renvoie une erreur au frontend
    })
    .catch((error) => {
      res.status(500).json({ error });
    }); // on renvoie une erreur (d'execution dans la BDD) au frontend
};
