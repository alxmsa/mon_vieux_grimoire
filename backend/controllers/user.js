const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash
      });

      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: 'Paire identifiant/mot de passe incorrect' });
      }

      bcrypt.compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ message: 'Paire identifiant/mot de passe incorrect' });
          }

          // Génération du Token JWT
          const token = jwt.sign(
            { userId: user._id },
            process.env.RANDOM_TOKEN_SECRET, // Clé secrète (à stocker dans .env)
            { expiresIn: '24h' }
          );
          console.log('✅ Token généré :', token);
          return res.status(200).json({
            userId: user._id,
            token: token
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};