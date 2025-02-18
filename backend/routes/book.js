const express = require('express');

const router = express.Router();

const bookCtrl = require('../controllers/book');

// requete post à confirmer apres avoir fait l'authentification
router.post('/', bookCtrl.createBook);
router.put('/:id', bookCtrl.modifyBook);
router.delete('/:id', bookCtrl.deleteBook);
router.get('/:id', bookCtrl.getOneBook);
router.get('/', bookCtrl.getAllBook);

module.exports = router;
