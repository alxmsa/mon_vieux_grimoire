// Importation des modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Charger les variables d'environnement
// Charger les variables d'environnement
dotenv.config({ path: "./.env" });
console.log("MONGO_URI:", process.env.MONGO_URI); // Ajoute ceci pour voir si la variable est bien chargée

// Initialisation d'Express
const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Activation de CORS (évite les erreurs de sécurité)
app.use(cors());

// Route de test pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.send('API Mon Vieux Grimoire est en ligne !');
});

// Connexion à la base de données MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Connexion MongoDB réussie !');
    // Importation des modèles après la connexion à MongoDB
    const User = require("./models/User");
    const Book = require("./models/Book");

    console.log("✅ Modèles User et Book chargés !");

  })
  .catch((err) => console.error('❌ Erreur de connexion MongoDB :', err));

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur en ligne sur http://localhost:${PORT}`);
});
