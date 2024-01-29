const mongoose = require("mongoose");

const thingSchema = mongoose.Schema({
  title: { type: String, required: true },
  // required: true = le titre est obligatoire
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  // on ne stocke pas l'image mais son url
  price: { type: Number, required: true },
  // le prix est en centimes car c'est ce qui est attendu et cela évite des problèmes d'arrymétique
  userId: { type: String, required: true },
});

module.exports = mongoose.model("Thing", thingSchema);
// la méthode model transforme ce modèle en un modèle utilisable dans l'application
