const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // on indique à multer d'enregistrer les fichiers dans le dossier images
    callback(null, "images"); // l'argment null signifie qu'il n'y a pas eu d'erreur à ce niveau là
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_"); // on indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores
    const extension = MIME_TYPES[file.mimetype]; // on utilise un dictionnaire pour résoudre l'extension de fichier appropriée
    callback(null, name + Date.now() + "." + extension); //on créer le filename complet avec le timestamp et l'extension
  },
});

module.exports = multer({ storage: storage }).single("image"); // on exporte l'élément multer entièrement configuré, on lui passe notre constante storage et on lui indique qu'il s'agit de fichiers images uniques (grâce à single)
