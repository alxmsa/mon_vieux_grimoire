const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');

const bookCtrl = require('../controllers/book');

const multer = require('../middleware/multer-config');

// requete post à confirmer apres avoir fait l'authentification
router.post('/', auth, multer, bookCtrl.createBook);
router.put('/:id', auth, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.get('/:id', bookCtrl.getOneBook);
router.get('/', bookCtrl.getAllBooks);

module.exports = router;
