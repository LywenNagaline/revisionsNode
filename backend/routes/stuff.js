const express = require("express");
const auth = require("../middleware/auth"); // il est important de placer le middleware d'authentification avant les routes qui ont besoin d'être authentifiées

const router = express.Router();

const stuffCtrl = require("../controllers/stuff");

router.post("/", auth, stuffCtrl.createThing); // il faut rajouter auth en deuxième argument pour sécuriser la route
router.put("/:id", auth, stuffCtrl.modifyThing);
router.delete("/:id", auth, stuffCtrl.deleteThing);
router.get("/:id", auth, stuffCtrl.getOneThing);
router.get("/", auth, stuffCtrl.getAllThings);

module.exports = router;
