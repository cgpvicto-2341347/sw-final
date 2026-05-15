import pool from '../config/db.js';

const creerPret = async (livreId, emprunteur, date_retour_prevue) => {
    const result = await pool.query(
        `INSERT INTO prets (livre_id, emprunteur, date_retour_prevue)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [livreId, emprunteur, date_retour_prevue]
    );
    return result.rows[0];
};

const modifierPret = async (id, emprunteur, date_retour_prevue) => {
    const result = await pool.query(
        `UPDATE prets
         SET emprunteur = $1, date_retour_prevue = $2
         WHERE id = $3
         RETURNING *`,
        [emprunteur, date_retour_prevue, id]
    );
    return result.rows[0] || null;
};

const modifierStatut = async (id, statut, date_retour_reelle) => {
    const result = await pool.query(
        `UPDATE prets
         SET statut = $1, date_retour_reelle = $2
         WHERE id = $3
         RETURNING *`,
        [statut, date_retour_reelle || null, id]
    );
    return result.rows[0] || null;
};

const supprimerPret = async (id) => {
    const result = await pool.query(
        `DELETE FROM prets
         WHERE id = $1
         RETURNING *`,
        [id]
    );
    return result.rows[0] || null;
};

export default { creerPret, modifierPret, modifierStatut, supprimerPret };