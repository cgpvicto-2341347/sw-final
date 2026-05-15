import express from 'express';
import { creer, getCleApi }from '../controllers/bibliotheque.controller.js';
const router = express.Router();
 
router.post('/', creer);
router.post('/cle-api', getCleApi);
 
export default router;
 