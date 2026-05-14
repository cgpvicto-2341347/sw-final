const pool = require('../config/db');

// Récupérer tous les livres d'une bibliothèque 
const getLivres = async (bibliothequeId, tous) => {
    let query = 'SELECT * FROM livres WHERE bibliotheque_id = $1';
    if (!tous) query += ' AND disponible = TRUE';
    const result = await pool.query(query, [bibliothequeId]);
    return result.rows;
};

// Récupérer le détail d'un livre avec ses prêts
const getLivre = async (id, bibliothequeId) => {
    const livreResult = await pool.query(
        'SELECT * FROM livres WHERE id = $1 AND bibliotheque_id = $2',
        [id, bibliothequeId]
    );

    if (livreResult.rows.length === 0) return null;

    const livre = livreResult.rows[0];

    const pretsResult = await pool.query(
        'SELECT * FROM prets WHERE livre_id = $1 ORDER BY date_debut DESC',
        [id]
    );

    livre.prets = pretsResult.rows.map(pret => ({
        ...pret,
        en_cours: pret.statut === 'en_cours'
    }));

    return livre;
};

// Ajouter un livre
const creerLivre = async (bibliothequeId, titre, auteur, isbn, description) => {
    const result = await pool.query(
        `INSERT INTO livres (bibliotheque_id, titre, auteur, isbn, description) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [bibliothequeId, titre, auteur, isbn, description]
    );
    return result.rows[0];
};

// Modifier un livre
const modifierLivre = async (id, bibliothequeId, titre, auteur, isbn, description) => {
    const result = await pool.query(
        `UPDATE livres 
         SET titre = $1, auteur = $2, isbn = $3, description = $4 
         WHERE id = $5 AND bibliotheque_id = $6 
         RETURNING *`,
        [titre, auteur, isbn, description, id, bibliothequeId]
    );
    return result.rows[0] || null;
};

// Modifier le statut d'un livre
const modifierStatut = async (id, bibliothequeId, disponible) => {
    const result = await pool.query(
        `UPDATE livres 
         SET disponible = $1 
         WHERE id = $2 AND bibliotheque_id = $3 
         RETURNING *`,
        [disponible, id, bibliothequeId]
    );
    return result.rows[0] || null;
};

// Supprimer un livre
const supprimerLivre = async (id, bibliothequeId) => {
    const result = await pool.query(
        `DELETE FROM livres 
         WHERE id = $1 AND bibliotheque_id = $2 
         RETURNING *`,
        [id, bibliothequeId]
    );
    return result.rows[0] || null;
};

module.exports = { getLivres, getLivre, creerLivre, modifierLivre, modifierStatut, supprimerLivre };