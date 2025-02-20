const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  description: { type: String, required: true },
  year: { type: Number, required: true },
  rating: {
    type: Number, required: false, min: 0, max: 5,
  },
  imageUrl: { type: String, required: false },
  userId: { type: String, required: true },
});

module.exports = mongoose.model('Book', bookSchema);
