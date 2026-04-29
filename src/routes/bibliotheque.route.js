const express = require('express');
const router = express.Router();
const bibliothequeController = require('../controllers/bibliotheque.controller');

// Inscription d'une nouvelle bibliothèque
router.post('/', bibliothequeController.creer);

// Récupérer ou régénérer une clé API
router.post('/cle-api', bibliothequeController.getCleApi);

module.exports = router;