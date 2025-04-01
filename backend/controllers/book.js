const Book = require('../models/Book');

exports.createBook = (req, res) => {
  console.log('✅ BookObject après parsing :', req.body);
  const bookObject = JSON.parse(req.body.book); // On parse les données JSON envoyées avc le fichier
  console.log('✅ BookObject après parsing :', bookObject);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId, // Récupéré via `auth.js`
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // Stocke l'URL de l'image
  });
  console.log('✅ Fichier reçu :', req.file);
  book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyBook = (req, res) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre modifié !' }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteBook = (req, res) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.rateBook = (req, res) => {
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

exports.bestBooks = (req, res) => {
  Book.find()
    .sort({ averageRating: -1 })
    // 🔹 Trie par `averageRating` en ordre décroissant (du + grand au + petit)
    .limit(3) // 🔹 Garde seulement les 3 premiers résultats
    .then((books) => res.status(200).json(books)) // 🔹 Renvoie les livres sous forme JSON
    .catch((error) => res.status(400).json({ error }));
};
