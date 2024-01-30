const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // on récupère le token dans le header de la requête entrante et on le divise en un tableau autour de l'espace qui se trouver entre le bearer et le token et le token (dans la console), et on récupère le token qui est dans la seconde case
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); // on décode le token
    const userId = decodedToken.userId; // on extrait l'userId du token
    if (req.body.userId && req.body.userId !== userId) {
      // on compare l'userId extrait du token avec celui envoyé dans la requête
      throw "User ID non valable !";
    } else {
      next(); // si tout est bon, on passe l'exécution à la prochaine fonction
    }
  } catch (error) {
    res.status(401).json({ error: error | "Requête non authentifiée !" }); // on renvoie une erreur au frontend
  }
};
