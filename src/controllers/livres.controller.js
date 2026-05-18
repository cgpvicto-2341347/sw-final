import livresModel from '../models/livres.model.js';

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

const getLivre = async (req, res) => {
    const bibliothequeId = req.bibliotheque.id;
    const { id } = req.params;
    try {
        const livre = await livresModel.getLivre(id, bibliothequeId);
        if (!livre) return res.status(404).json({ erreur: 'Livre non trouvé.' });
        res.status(200).json(livre);
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur serveur.' });
    }
};

const creerLivre = async (req, res) => {
    const bibliothequeId = req.bibliotheque.id;
    const { titre, auteur, isbn } = req.body;
    if (!titre || !auteur || !isbn) {
        return res.status(400).json({ erreur: 'Titre, auteur et ISBN sont requis.' });
    }
    try {
        const livre = await livresModel.creerLivre(bibliothequeId, titre, auteur, isbn);
        res.status(201).json(livre);
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur serveur.' });
    }
};

const modifierLivre = async (req, res) => {
    const bibliothequeId = req.bibliotheque.id;
    const { id } = req.params;
    const { titre, auteur, isbn } = req.body;
    if (!titre || !auteur || !isbn) {
        return res.status(400).json({ erreur: 'Titre, auteur et ISBN sont requis.' });
    }
    try {
        const livre = await livresModel.modifierLivre(id, bibliothequeId, titre, auteur, isbn);
        if (!livre) return res.status(404).json({ erreur: 'Livre non trouvé.' });
        res.status(200).json(livre);
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur serveur.' });
    }
};

const modifierStatut = async (req, res) => {
    const bibliothequeId = req.bibliotheque.id;
    const { id } = req.params;
    const { disponible } = req.body;
    
    try {
        let livre
        if(disponible)
            livre = await livresModel.modifierStatut(id, bibliothequeId, true);
        else
            livre = await livresModel.modifierStatut(id, bibliothequeId, false);
        if (!livre) return res.status(404).json({ erreur: 'Livre non trouvé.' });
        res.status(200).json(livre);
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur serveur.' });
    }
};

const supprimerLivre = async (req, res) => {
    const bibliothequeId = req.bibliotheque.id;
    const { id } = req.params;
    try {
        const livre = await livresModel.supprimerLivre(id, bibliothequeId);
        if (!livre) return res.status(404).json({ erreur: 'Livre non trouvé.' });
        res.status(200).json({ message: 'Livre supprimé avec succès.' });
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur serveur.' });
    }
};

export { getLivres, getLivre, creerLivre, modifierLivre, modifierStatut, supprimerLivre };