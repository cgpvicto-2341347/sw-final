import express from 'express';
import { getLivres, getLivre, creerLivre, modifierLivre, modifierStatut, supprimerLivre } from '../controllers/livres.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
 
const router = express.Router();
 
router.get('/', authMiddleware, getLivres);
router.get('/:id', authMiddleware,  getLivre);
router.post('/', authMiddleware,  creerLivre);
router.put('/:id', authMiddleware,  modifierLivre);
router.patch('/:id/statut', authMiddleware,  modifierStatut);
router.delete('/:id', authMiddleware,  supprimerLivre);
 
export default router;