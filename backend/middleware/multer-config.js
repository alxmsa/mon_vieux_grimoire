const multer = require('multer');

// Définir les types MIME acceptés pour les images
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Configuration de multer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images'); // Sauvegarde les fichiers dans le dossier "images"
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); // Remplace les espaces par des "_"
    const extension = MIME_TYPES[file.mimetype]; // Récupère l'extension correcte
    callback(null, name + Date.now() + '.' + extension); // Génère un nom unique
  }
});

module.exports = multer({ storage }).single('image'); // On accepte un seul fichier appelé "image"
