const pool = require('../config/db');

// Créer une nouvelle bibliothèque
const creer = async (nom, courriel, password) => {
    const result = await pool.query(
        `INSERT INTO bibliotheque (nom, courriel, password) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
        [nom, courriel, password]
    );
    return result.rows[0];
};

// Trouver une bibliothèque par courriel
const getParCourriel = async (courriel) => {
    const result = await pool.query(
        'SELECT * FROM bibliotheque WHERE courriel = $1',
        [courriel]
    );
    return result.rows[0] || null;
};

// Régénérer la clé API
const regenererCleApi = async (id) => {
    const result = await pool.query(
        `UPDATE bibliotheque 
         SET cle_api = gen_random_uuid() 
         WHERE id = $1 
         RETURNING cle_api`,
        [id]
    );
    return result.rows[0].cle_api;
};

module.exports = { creer, getParCourriel, regenererCleApi };