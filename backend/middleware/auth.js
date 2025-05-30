require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
// Vérifie si un token est bien présent dans l'en-tête Authorization
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Token non fourni !' });
  }

  try {
    // Extrait le token en supprimant le préfixe 'Bearer'
    const token = req.headers.authorization.split(' ')[1];
    // Vérifie et décode le token avec la clé secrète .env
    const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
    // Extrait l'ID utilisateur du token
    const userId = decodedToken.userId;
    // Ajoute l'ID utilisateur à l'objet de requête pour une utilisation ultérieure
    req.auth = { userId };
    // Passe au middleware suivant
    next();
  } catch (error) {
    // En cas d'erreur, renvoie une réponse 401 Unauthorized
    res.status(401).json({ error: 'Requête non authentifiée !' });
  }
};
