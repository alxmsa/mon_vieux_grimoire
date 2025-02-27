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
