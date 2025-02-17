const express = require('express');

const app = express();

app.use('/api/book', (req, res, next) => {
  const book = [
    {
      _id: 'oeihfzeoi',
      title: 'Milwaukee Mission',
      auteur: 'Eleder Cooper',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      date: '2021',
      type: 'Policier',
      userId: 'qsomihvqios',
    },
    {
      _id: 'oeihfzeomoihi',
      title: 'Mon deuxième livre',
      auteur: 'Moussa Diop',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      date: '2025',
      type: 'Légendaire',
      userId: 'qsomihvqios',
    },
  ];
  res.status(200).json(book);
  next();
});

module.exports = app;
