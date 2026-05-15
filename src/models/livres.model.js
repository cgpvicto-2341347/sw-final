import pool from '../config/db.js';

const getLivres = async (bibliothequeId, tous) => {
    let query = 'SELECT * FROM livres WHERE bibliotheque_id = $1';
    if (!tous) query += ' AND disponible = TRUE';
    const result = await pool.query(query, [bibliothequeId]);
    return result.rows;
};

const getLivre = async (id, bibliothequeId) => {
    const livreResult = await pool.query(
        'SELECT * FROM livres WHERE id = $1 AND bibliotheque_id = $2',
        [id, bibliothequeId]
    );

    if (livreResult.rows.length === 0) return null;

    const livre = livreResult.rows[0];

    const pretsResult = await pool.query(
        'SELECT * FROM prets WHERE livre_id = $1 ORDER BY date_emprunt DESC',
        [id]
    );

    livre.prets = pretsResult.rows.map(pret => ({
        ...pret,
        en_cours: pret.statut === 'EN_COURS'
    }));

    return livre;
};

const creerLivre = async (bibliothequeId, titre, auteur, isbn) => {
    const result = await pool.query(
        `INSERT INTO livres (bibliotheque_id, titre, auteur, isbn) VALUES ($1, $2, $3, $4) RETURNING *`,
        [bibliothequeId, titre, auteur, isbn]
    );
    return result.rows[0];
};

const modifierLivre = async (id, bibliothequeId, titre, auteur, isbn) => {
    const result = await pool.query(
        `UPDATE livres SET titre = $1, auteur = $2, isbn = $3 WHERE id = $4 AND bibliotheque_id = $5 RETURNING *`,
        [titre, auteur, isbn, id, bibliothequeId]
    );
    return result.rows[0] || null;
};

const modifierStatut = async (id, bibliothequeId, disponible) => {
    const result = await pool.query(
        `UPDATE livres SET disponible = $1 WHERE id = $2 AND bibliotheque_id = $3 RETURNING *`,
        [disponible, id, bibliothequeId]
    );
    return result.rows[0] || null;
};

const supprimerLivre = async (id, bibliothequeId) => {
    const result = await pool.query(
        `DELETE FROM livres WHERE id = $1 AND bibliotheque_id = $2 RETURNING *`,
        [id, bibliothequeId]
    );
    return result.rows[0] || null;
};

export default { getLivres, getLivre, creerLivre, modifierLivre, modifierStatut, supprimerLivre };