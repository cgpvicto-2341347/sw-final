const livresModel = require('../models/livres.model');

// GET /api/livres
// Afficher tous les livres de la bibliothèque (par défaut seulement les disponibles)
const getLivres = async (req, res) => {
    const bibliothequeId = req.bibliotheque.id;
    const tous = req.query.tous === 'true';

    try {
        const livres = await livresModel.getLivres(bibliothequeId, tous);
        res.status(200).json(livres);
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur serveur.' });
    }
};

// GET /api/livres/:id
// Afficher le détail d'un livre avec ses prêts
const getLivre = async (req, res) => {
    const bibliothequeId = req.bibliotheque.id;
    const { id } = req.params;

    try {
        const livre = await livresModel.getLivre(id, bibliothequeId);
        if (!livre) {
            return res.status(404).json({ erreur: 'Livre non trouvé.' });
        }
        res.status(200).json(livre);
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur serveur.' });
    }
};

// POST /api/livres
// Ajouter un livre
const creerLivre = async (req, res) => {
    const bibliothequeId = req.bibliotheque.id;
    const { titre, auteur, isbn, description } = req.body;

    if (!titre || !auteur || !isbn) {
        return res.status(400).json({ erreur: 'Titre, auteur et ISBN sont requis.' });
    }

    try {
        const livre = await livresModel.creerLivre(bibliothequeId, titre, auteur, isbn, description);
        res.status(201).json(livre);
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur serveur.' });
    }
};

// PUT /api/livres/:id
// Modifier un livre
const modifierLivre = async (req, res) => {
    const bibliothequeId = req.bibliotheque.id;
    const { id } = req.params;
    const { titre, auteur, isbn, description } = req.body;

    if (!titre || !auteur || !isbn) {
        return res.status(400).json({ erreur: 'Titre, auteur et ISBN sont requis.' });
    }

    try {
        const livre = await livresModel.modifierLivre(id, bibliothequeId, titre, auteur, isbn, description);
        if (!livre) {
            return res.status(404).json({ erreur: 'Livre non trouvé.' });
        }
        res.status(200).json(livre);
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur serveur.' });
    }
};

// PATCH /api/livres/:id/statut
// Modifier uniquement le statut d'un livre
const modifierStatut = async (req, res) => {
    const bibliothequeId = req.bibliotheque.id;
    const { id } = req.params;
    const { disponible } = req.body;

    if (disponible === undefined) {
        return res.status(400).json({ erreur: 'Le champ disponible est requis.' });
    }

    try {
        const livre = await livresModel.modifierStatut(id, bibliothequeId, disponible);
        if (!livre) {
            return res.status(404).json({ erreur: 'Livre non trouvé.' });
        }
        res.status(200).json(livre);
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur serveur.' });
    }
};

// DELETE /api/livres/:id
// Supprimer un livre
const supprimerLivre = async (req, res) => {
    const bibliothequeId = req.bibliotheque.id;
    const { id } = req.params;

    try {
        const livre = await livresModel.supprimerLivre(id, bibliothequeId);
        if (!livre) {
            return res.status(404).json({ erreur: 'Livre non trouvé.' });
        }
        res.status(200).json({ message: 'Livre supprimé avec succès.' });
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur serveur.' });
    }
};

module.exports = { getLivres, getLivre, creerLivre, modifierLivre, modifierStatut, supprimerLivre };