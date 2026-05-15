import pool from '../config/db.js';

const authentification = async (req, res, next) => {
    const cleApi = req.headers.authorization;

    if (!cleApi) {
        return res.status(401).json({ erreur: 'Clé API manquante.' });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM bibliotheque WHERE cle_api = $1',
            [cleApi]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ erreur: 'Clé API invalide.' });
        }

        // On attache la bibliothèque à la requête pour l'utiliser dans les controllers
        req.bibliotheque = result.rows[0];
        next();

    } catch (error) {
        res.status(500).json({ erreur: 'Erreur serveur.' });
    }
}
export default authentification; 