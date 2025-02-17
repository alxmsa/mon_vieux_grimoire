/* eslint-disable arrow-parens */
/* eslint-disable no-underscore-dangle */
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const Book = require('./models/Book');

mongoose.connect(
  'mongodb+srv://musa:mufasa@cluster0.yraqn.mongodb.net/NOM_DE_TA_BASE_DE_DONNEES?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// requete post à confirmer apres avoir fait l'authentification
app.post('/api/books', (req, res, next) => {
  delete req.body._id;
  const book = new Book({
    ...req.body,
  });
  book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
    .catch(error => res.status(400).json({ error }));
  next();
});

app.put('/api/books/:id', (req, res, next) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre modifié !'}))
    .catch(error => res.status(400).json({ error }));
  next();
});

app.delete('/api/books/:id', (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre supprimé !'}))
    .catch(error => res.status(400).json({ error }));
  next();
});

app.get('/api/books', (req, res, next) => {
  const books = [
    {
      _id: 'oeihfzeoi',
      title: 'Mon premier objet',
      author: 'Moussa Diop',
      genre: 'romantique',
      description: 'Superbe livre écrit par moussa diop',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      rating: 3,
      userId: 'qsomihvqios',
    },
    {
      _id: 'oeihfzeomoihi',
      title: 'Mon deuxième objet',
      description: 'Les infos de mon deuxième objet',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      price: 2900,
      userId: 'qsomihvqios',
    },
  ];
  res.status(200).json(books);
  next();
});

module.exports = app;
