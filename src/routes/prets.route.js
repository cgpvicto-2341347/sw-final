import express from 'express';
import { creerPret, modifierPret, modifierStatut, supprimerPret } from '../controllers/prets.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
 
const router = express.Router();
 
router.post('/', authMiddleware, creerPret);
router.put('/:id', authMiddleware, modifierPret);
router.patch('/:id/statut', authMiddleware, modifierStatut);
router.delete('/:id', authMiddleware,  supprimerPret);
 
export default router;