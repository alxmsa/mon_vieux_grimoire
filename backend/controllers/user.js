const bcrypt = require('bcrypt');

const User = require('../models/User');

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10);
  .then(hash => {
    const user = new user({
        email: req.body.email,
        password: hash
    });
    user.save()
      .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
      .catch((error) => res.status(400).json({ error }));
  })
  .catch((error) => res.status(500).json({ error }))
  next();
};

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
      .then(user => {
        if(user === null){
            res.status(401).json({message: 'Paire identifiant/mot de passe incorrect'});
        }else{
            bcrypt.compare(req.body.password, user.password)
            .then((valid) => {
                if(!valid){
                    res.status(401).json({message: 'Paire identifiant/mot de passe incorrect'});
                }else{
                    res.status(200).json({
                        userId: user_id,
                        token: 'TOKEN'
                    });
                }

            })
            .catch((error) => {
                res.status(500).json({ error });
            });
        }
      })
      .catch((error) => {
        res.status(500).json( {error});
      });
};