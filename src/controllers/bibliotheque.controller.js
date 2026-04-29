const bibliothequeModel = require('../models/bibliotheque.model');
const bcrypt = require('bcrypt');

// POST /api/bibliotheques
// Créer une nouvelle bibliothèque
const creer = async (req, res) => {
    const { nom, courriel, password } = req.body;

    if (!nom || !courriel || !password) {
        return res.status(400).json({ erreur: 'Nom, courriel et mot de passe sont requis.' });
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        const bibliotheque = await bibliothequeModel.creer(nom, courriel, hash);
        res.status(201).json({
            message: 'Bibliothèque créée avec succès.',
            cle_api: bibliotheque.cle_api
        });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ erreur: 'Ce courriel est déjà utilisé.' });
        }
        res.status(500).json({ error });
    }
};

// POST /api/bibliotheques/cle-api
// Récupérer ou régénérer une clé API
const getCleApi = async (req, res) => {
    const { courriel, password, regenerer } = req.body;

    if (!courriel || !password) {
        return res.status(400).json({ erreur: 'Courriel et mot de passe sont requis.' });
    }

    try {
        const bibliotheque = await bibliothequeModel.getParCourriel(courriel);

        if (!bibliotheque) {
            return res.status(404).json({ erreur: 'Aucune bibliothèque trouvée avec ce courriel.' });
        }

        const passwordValide = await bcrypt.compare(password, bibliotheque.password);
        if (!passwordValide) {
            return res.status(401).json({ erreur: 'Mot de passe incorrect.' });
        }

        // Si le paramètre regenerer est true, on génère une nouvelle clé API
        if (regenerer === true) {
            const nouvelleCle = await bibliothequeModel.regenererCleApi(bibliotheque.id);
            return res.status(200).json({
                message: 'Nouvelle clé API générée.',
                cle_api: nouvelleCle
            });
        }

        res.status(200).json({ cle_api: bibliotheque.cle_api });

    } catch (error) {
    console.log('Erreur:', error.message);
    if (error.code === '23505') {
        return res.status(409).json({ erreur: 'Ce courriel est déjà utilisé.' });
    }
    res.status(500).json({ erreur: 'Erreur serveur.' });
}
};

module.exports = { creer, getCleApi };