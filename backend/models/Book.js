const mongoose = require("mongoose");

// Modèle de livre
const bookSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // ID de l'utilisateur qui a ajouté le livre
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
      userId: { type: String, required: true },
      grade: { type: Number, required: true, min: 0, max: 5 }, // Note entre 0 et 5
    },
  ],
  averageRating: { type: Number, default: 0 }, // Note moyenne calculée
});

module.exports = mongoose.model("Book", bookSchema);
