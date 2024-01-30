const Thing = require("../models/Thing");
const fs = require("fs"); // on importe le package fs de Node pour avoir accès aux fonctions qui nous permettent de modifier le système de fichiers

exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.thing); // on transforme l'objet requête JSON sous forme de caractères en objet JS du fait de multer
  delete thingObject._id; // on supprime l'id envoyé par le front-end car il sera généré par le serveur MongoDB
  delete thingObject._userId; // on supprime aussi le userId du client pour utiliser celui du token pour lequel on est certain que c'est le bon. Cela empêche un utilisateur malveillant de modifier le userId pour modifier les données d'un autre utilisateur
  const thing = new Thing({
    ...thingObject, // on utilise l'opérateur spread pour copier tous les éléments de thingObject
    userId: req.auth.userId, // on ajoute le userId du token
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`, // on génère l'url de l'image car multer ne donne que le nom de fichier: protocol://host/images/nomdufichier
  });
  thing
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyThing = (req, res, next) => {
  const thingObject = req.file
    ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body }; // on utilise l'opérateur ternaire pour vérifier si req.file existe. Si oui, on traite la nouvelle image. Si non, on traite simplement l'objet entrant
  delete thingObject._userId; // on supprime aussi le userId du client pour utiliser celui du token pour lequel on est certain que c'est le bon. Cela empêche un utilisateur malveillant de modifier le userId pour modifier les données d'un autre utilisateur
  Thing.findOne({ _id: req.params.id })
    .then((thing) => {
      if (thing.userId !== req.auth.userId) {
        // on compare le userId de l'objet avec celui du token
        res.status(401).json({ message: "Non-autorisé" }); // si c'est différent, on renvoie une erreur
      } else {
        Thing.updateOne(
          { _id: req.params.id },
          { ...thingObject, _id: req.params.id }
        ) // on utilise l'opérateur spread pour copier tous les éléments de thingObject et on ajoute l'id de l'objet
          .then(() => res.status(200).json({ message: "Objet modifié !" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};

exports.deleteThing = (req, res, next) => {
  //On supprime les fichiers uniquement si c'est le bon utilisatieur qui fait la demande et qui supprime les fichiers images
  Thing.findOne({ _id: req.params.id })
    .then((thing) => {
      if (thing.userId !== req.auth.userId) {
        // on compare le userId de l'objet avec celui du token
        res.status(401).json({ message: "Non-autorisé" }); // si c'est différent, on renvoie une erreur
      } else {
        const filename = thing.imageUrl.split("/images/")[1]; // on récupère le nom du fichier à supprimer
        fs.unlink(`images/${filename}`, () => {
          // on utilise la fonction unlink du package fs pour supprimer le fichier
          Thing.deleteOne({ _id: req.params.id }) // on supprime l'objet de la base de données
            .then(() => res.status(200).json({ message: "Objet supprimé !" }))
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getOneThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then((thing) => res.status(200).json(thing))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllThings = (req, res, next) => {
  Thing.find()
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(400).json({ error }));
};
