const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Modèle utilisateur
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Email unique
  password: { type: String, required: true }, // Mot de passe haché
});

// Plugin pour éviter les erreurs d'emails en double
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);