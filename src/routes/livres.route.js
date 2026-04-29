const express = require('express');
const router = express.Router();
const livresController = require('../controllers/livres.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

// Liste des livres de la bibliothèque
router.get('/', livresController.getLivres);

// Détail d'un livre
router.get('/:id', livresController.getLivre);

// Ajouter un livre
router.post('/', livresController.creerLivre);

// Modifier un livre
router.put('/:id', livresController.modifierLivre);

// Modifier le statut d'un livre
router.patch('/:id/statut', livresController.modifierStatut);

// Supprimer un livre
router.delete('/:id', livresController.supprimerLivre);

module.exports = router;