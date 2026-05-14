const pretsModel = require('../models/prets.model');
const livresModel = require('../models/livres.model');

// Ajouter un prêt
const creerPret = async (req, res) => {
    const bibliothequeId = req.bibliotheque.id;
    const { livre_id, emprunteur, date_debut, date_retour } = req.body;

    if (!livre_id || !emprunteur || !date_retour) {
        return res.status(400).json({ erreur: 'livre_id, emprunteur et date_retour sont requis.' });
    }

    try {
        const livre = await livresModel.getLivre(livre_id, bibliothequeId);
        if (!livre) {
            return res.status(404).json({ erreur: 'Livre non trouvé.' });
        }
        if (!livre.disponible) {
            return res.status(409).json({ erreur: 'Ce livre est déjà emprunté.' });
        }

        const pret = await pretsModel.creerPret(livre_id, emprunteur, date_debut, date_retour);

        // Mettre le livre comme emprunté automatiquement
        await livresModel.modifierStatut(livre_id, bibliothequeId, false);

        res.status(201).json(pret);
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur serveur.' });
    }
};

// Modifier un prêt
const modifierPret = async (req, res) => {
    const { id } = req.params;
    const { emprunteur, date_debut, date_retour } = req.body;

    if (!emprunteur || !date_retour) {
        return res.status(400).json({ erreur: 'emprunteur et date_retour sont requis.' });
    }

    try {
        const pret = await pretsModel.modifierPret(id, emprunteur, date_debut, date_retour);
        if (!pret) {
            return res.status(404).json({ erreur: 'Prêt non trouvé.' });
        }
        res.status(200).json(pret);
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur serveur.' });
    }
};

// Modifier le statut d'un prêt
const modifierStatut = async (req, res) => {
    const bibliothequeId = req.bibliotheque.id;
    const { id } = req.params;
    const { statut, date_retour_reelle } = req.body;

    if (!statut) {
        return res.status(400).json({ erreur: 'Le champ statut est requis.' });
    }

    try {
        const pret = await pretsModel.modifierStatut(id, statut, date_retour_reelle);
        if (!pret) {
            return res.status(404).json({ erreur: 'Prêt non trouvé.' });
        }

        // Si le prêt est terminé, remettre le livre comme disponible
        if (statut === 'termine') {
            await livresModel.modifierStatut(pret.livre_id, bibliothequeId, true);
        }

        res.status(200).json(pret);
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur serveur.' });
    }
};

// Supprimer un prêt
const supprimerPret = async (req, res) => {
    const { id } = req.params;

    try {
        const pret = await pretsModel.supprimerPret(id);
        if (!pret) {
            return res.status(404).json({ erreur: 'Prêt non trouvé.' });
        }
        res.status(200).json({ message: 'Prêt supprimé avec succès.' });
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur serveur.' });
    }
};

module.exports = { creerPret, modifierPret, modifierStatut, supprimerPret };