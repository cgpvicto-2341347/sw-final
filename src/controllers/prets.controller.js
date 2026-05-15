import pretsModel from '../models/prets.model.js';
import livresModel from '../models/livres.model.js';

const creerPret = async (req, res) => {
    const bibliothequeId = req.bibliotheque.id;
    const { livre_id, emprunteur, date_retour_prevue } = req.body;

    if (!livre_id || !emprunteur || !date_retour_prevue) {
        return res.status(400).json({ erreur: 'livre_id, emprunteur et date_retour_prevue sont requis.' });
    }

    try {
        const livre = await livresModel.getLivre(livre_id, bibliothequeId);
        if (!livre) return res.status(404).json({ erreur: 'Livre non trouvé.' });
        if (!livre.disponible) return res.status(409).json({ erreur: 'Ce livre est déjà emprunté.' });

        const pret = await pretsModel.creerPret(livre_id, emprunteur, date_retour_prevue);
        await livresModel.modifierStatut(livre_id, bibliothequeId, false);

        res.status(201).json(pret);
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur serveur.' });
    }
};

const modifierPret = async (req, res) => {
    const { id } = req.params;
    const { emprunteur, date_retour_prevue } = req.body;

    if (!emprunteur || !date_retour_prevue) {
        return res.status(400).json({ erreur: 'emprunteur et date_retour_prevue sont requis.' });
    }

    try {
        const pret = await pretsModel.modifierPret(id, emprunteur, date_retour_prevue);
        if (!pret) return res.status(404).json({ erreur: 'Prêt non trouvé.' });
        res.status(200).json(pret);
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur serveur.' });
    }
};

const modifierStatut = async (req, res) => {
    const bibliothequeId = req.bibliotheque.id;
    const { id } = req.params;
    const { statut, date_retour_reelle } = req.body;

    if (!statut) {
        return res.status(400).json({ erreur: 'Le champ statut est requis.' });
    }

    if (statut !== 'EN_COURS' && statut !== 'RETOURNE') {
        return res.status(400).json({ erreur: "Le statut doit être 'EN_COURS' ou 'RETOURNE'." });
    }

    try {
        const pret = await pretsModel.modifierStatut(id, statut, date_retour_reelle);
        if (!pret) return res.status(404).json({ erreur: 'Prêt non trouvé.' });

        if (statut === 'RETOURNE') {
            await livresModel.modifierStatut(pret.livre_id, bibliothequeId, true);
        }

        res.status(200).json(pret);
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur serveur.' });
    }
};

const supprimerPret = async (req, res) => {
    const { id } = req.params;

    try {
        const pret = await pretsModel.supprimerPret(id);
        if (!pret) return res.status(404).json({ erreur: 'Prêt non trouvé.' });
        res.status(200).json({ message: 'Prêt supprimé avec succès.' });
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur serveur.' });
    }
};

export { creerPret, modifierPret, modifierStatut, supprimerPret };