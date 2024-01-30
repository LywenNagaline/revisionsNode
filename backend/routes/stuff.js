const express = require("express");
const auth = require("../middleware/auth"); // il est important de placer le middleware d'authentification avant les routes qui ont besoin d'être authentifiées
const multer = require("../middleware/multer-config");

const router = express.Router();

const stuffCtrl = require("../controllers/stuff");

router.post("/", auth, multer, stuffCtrl.createThing); // il faut rajouter auth en deuxième argument pour sécuriser la route. On rajoute multer en troisième argument pour gérer les fichiers entrants
router.put("/:id", auth, multer, stuffCtrl.modifyThing);
router.delete("/:id", auth, stuffCtrl.deleteThing);
router.get("/:id", auth, stuffCtrl.getOneThing);
router.get("/", auth, stuffCtrl.getAllThings);

module.exports = router;
