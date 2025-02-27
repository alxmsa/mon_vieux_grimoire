require('dotenv').config();
const jwt = require('jsonwebtoken');

console.log("✅ Middleware auth.js chargé !"); // 🔥 Test pour voir si le fichier est bien exécuté

module.exports = (req, res, next) => {
  console.log("🔍 Headers reçus :", req.headers); // Voir tous les headers envoyés

  // Vérifie si l'en-tête Authorization est présent
  if (!req.headers.authorization) {
    console.log("🔴 Aucun token reçu !");
    return res.status(401).json({ error: 'Token non fourni !' });
  }

  try {
    // Récupère le token en supprimant le préfixe 'Bearer'
    const token = req.headers.authorization.split(' ')[1];
    console.log("✅ Token extrait :", token);
    // Vérifie et décode le token
    console.log("✅ Clé secrète utilisée :", process.env.RANDOM_TOKEN_SECRET);
    const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
    console.log("✅ Token décodé :", decodedToken);
    // Extrait l'ID utilisateur du token
    const userId = decodedToken.userId;
    // Ajoute l'ID utilisateur à l'objet de requête pour une utilisation ultérieure
    req.auth = { userId };
    // Passe au middleware suivant
    next();
  } catch (error) {
    // En cas d'erreur, renvoie une réponse 401 Unauthorized
    console.log("❌ Erreur JWT :", error.message);
    res.status(401).json({ error: 'Requête non authentifiée !' });
  }
};
