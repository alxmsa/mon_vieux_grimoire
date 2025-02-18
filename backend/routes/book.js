const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');

const bookCtrl = require('../controllers/book');

// requete post à confirmer apres avoir fait l'authentification
router.post('/', auth, bookCtrl.createBook);
router.put('/:id', auth, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.get('/:id', auth, bookCtrl.getOneBook);
router.get('/', auth, bookCtrl.getAllBooks);

module.exports = router;
