import pool from '../config/db.js';
 
// Ajouter un prêt
const creerPret = async (livreId, emprunteur, date_debut, date_retour) => {
    const result = await pool.query(
        `INSERT INTO prets (livre_id, emprunteur, date_debut, date_retour)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [livreId, emprunteur, date_debut || new Date(), date_retour]
    );
    return result.rows[0];
};
 
// Modifier un prêt
const modifierPret = async (id, emprunteur, date_debut, date_retour) => {
    const result = await pool.query(
        `UPDATE prets
         SET emprunteur = $1, date_debut = $2, date_retour = $3
         WHERE id = $4
         RETURNING *`,
        [emprunteur, date_debut, date_retour, id]
    );
    return result.rows[0] || null;
};
 
// Modifier le statut d'un prêt
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
 
// Supprimer un prêt
const supprimerPret = async (id) => {
    const result = await pool.query(
        `DELETE FROM prets
         WHERE id = $1
         RETURNING *`,
        [id]
    );
    return result.rows[0] || null;
};
 
export default{ creerPret, modifierPret, modifierStatut, supprimerPret };