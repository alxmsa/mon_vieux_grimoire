const Book = require('../models/Book');
const sharp = require('sharp');
const fs = require ('fs');
const path = require('path');

const createBook = (req, res) => {
  try {
    // Parse les données JSON du livre
    const bookObject = JSON.parse(req.body.book);
    // eslint-disable-next-line max-len
    // suppression _id et _userId pour éviter qu'une personne inject volontairement un id qui n'est pas le sien
    delete bookObject._id;
    delete bookObject._userId;

    const originalFilename = req.file.filename.split('.')[0];
    const optimizedFilename = `optimized_${originalFilename}.webp`;
    const inputPath = `images/${req.file.filename}`;
    const outputPath = `images/${optimizedFilename}`;

    // vérification image
    if (!fs.existsSync(inputPath)) {
      return res.status(400).json({ message: 'Image introuvable après upload.' });
    }

    sharp(inputPath)
      .resize({ width: 800 })
      .webp({ quality: 70 })
      .toFile(outputPath)
      .then(() => {
        fs.unlink(inputPath, () => {
        });

        const book = new Book({
          ...bookObject,
          userId: req.auth.userId,
          imageUrl: `${req.protocol}://${req.get('host')}/images/${optimizedFilename}`,
        });

        book.save()
          .then(() => {
            res.status(201).json({ message: 'Livre enregistré !' });
          })
          .catch((error) => {
            res.status(400).json({ error });
          });
      })
      .catch((err) => {
        res.status(500).json({ message: 'Erreur lors du traitement de l’image.', error: err.message });
      });
  } catch (error) {
    res.status(400).json({ message: 'Données du livre invalides.', error: error.message });
  }
};

const modifyBook = (req, res, next) => {
  const bookId = req.params.id;

  // pas de nouvelle image → update direct
  if (!req.file) {
    const updateData = { ...req.body, _id: bookId };

    Book.updateOne({ _id: bookId }, updateData)
      .then(() => res.status(200).json({ message: 'Modifié sans image' }))
      .catch((error) => res.status(400).json(error));
    return;
  }

  // modif AVEC image → sharp + suppression ancienne

  const originalName = path.parse(req.file.filename).name;
  const optimizedFilename = `optimized_${originalName}.webp`;
  const inputPath = `images/${req.file.filename}`;
  const outputPath = `images/${optimizedFilename}`;

  Book.findOne({ _id: bookId })
    .then((book) => {
      if (!book) return res.status(404).json({ message: 'Livre non trouvé' });

      const oldImage = book.imageUrl?.split('/images/')[1];
      if (oldImage) {
        fs.unlink(`images/${oldImage}`, (err) => {
          if (err) console.warn('⚠️ Suppression ancienne image échouée :', err.message);
        });
      }

      sharp(inputPath)
        .resize({ width: 800 })
        .webp({ quality: 70 })
        .toFile(outputPath)
        .then(() => {
          fs.unlink(inputPath, (err) => {
            if (err) console.warn('⚠️ Suppression image temporaire échouée :', err.message);
          });

          const newImageUrl = `${req.protocol}://${req.get('host')}/images/${optimizedFilename}`;
          const bookObject = JSON.parse(req.body.book);

          const updateData = {
            ...bookObject,
            imageUrl: newImageUrl,
            _id: bookId,
          };

          Book.updateOne({ _id: bookId }, updateData)
            .then(() => res.status(200).json({ message: 'Modifié avec image' }))
            .catch((error) => {
              console.error('❌ Erreur updateOne :', error);
              res.status(400).json(error);
            });
        })
        .catch((error) => {
          console.error('❌ Erreur Sharp :', error.message);
          res.status(500).json({ message: 'Erreur traitement image', error: error.message });
        });
    })
    .catch((error) => {
      console.error('❌ Erreur findOne :', error.message);
      res.status(500).json({ message: 'Erreur récupération du livre', error: error.message });
    });
};

const deleteBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }

      const filename = book.imageUrl.split('/images/')[1];

      // Supprimer l'image
      fs.unlink(`images/${filename}`, (err) => {
        if (err) {
          console.warn('⚠️ Impossible de supprimer le fichier image :', err.message);
        } else {
          console.log(`🗑️ Image supprimée : images/${filename}`);
        }

        // Supprimer le livre après suppression image
        Book.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Livre et image supprimés !' }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

const getOneBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

const getAllBooks = (req, res) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

const rateBook = (req, res) => {
  const { rating } = req.body; // La note envoyée par l'utilisateur (ex: { "rating": 4 })
  const userId = req.auth.userId; // L'utilisateur connecté qui note le livre

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé !' });
      }

      // Vérifier si l'utilisateur a déjà noté ce livre
      const existingRating = book.ratings.find(r => r.userId === userId);
      if (existingRating) {
        return res.status(400).json({ message: 'Vous avez déjà noté ce livre.' });
      }

      // Ajouter la nouvelle note dans le tableau `ratings`
      book.ratings.push({ userId, grade: rating });

      // Recalculer `averageRating`
      const totalRatings = book.ratings.length;
      const sumRatings = book.ratings.reduce((sum, r) => sum + r.grade, 0);
      book.averageRating = (sumRatings / totalRatings).toFixed(1); // Arrondi à 1 décimale

      // Sauvegarder les modifications
      book.save()
        .then(() => res.status(200).json(book))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

const bestBooks = (req, res) => {
  Book.find()
    .sort({ averageRating: -1 })
    // 🔹 Trie par `averageRating` en ordre décroissant (du + grand au + petit)
    .limit(3) // 🔹 Garde seulement les 3 premiers résultats
    .then((books) => res.status(200).json(books)) // 🔹 Renvoie les livres sous forme JSON
    .catch((error) => res.status(400).json({ error }));
};

module.exports = {
  createBook,
  modifyBook,
  deleteBook,
  getOneBook,
  getAllBooks,
  rateBook,
  bestBooks,
};
