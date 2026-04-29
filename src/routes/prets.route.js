const express = require('express');
const router = express.Router();
const pretsController = require('../controllers/prets.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

// Ajouter un prêt
router.post('/', pretsController.creerPret);

// Modifier un prêt
router.put('/:id', pretsController.modifierPret);

// Modifier le statut d'un prêt
router.patch('/:id/statut', pretsController.modifierStatut);

// Supprimer un prêt
router.delete('/:id', pretsController.supprimerPret);

module.exports = router;