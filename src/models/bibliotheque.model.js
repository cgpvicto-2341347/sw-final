import pool from '../config/db.js';
import bcrypt from 'bcrypt';

const validationCle = async (cleApi) => {
    const result = await pool.query(
        'SELECT * FROM bibliotheque WHERE cle_api = $1 LIMIT 1',
        [cleApi]
    );
    return result.rows[0] || null;
};

const creerBibliotheque = async (nom, courriel, password) => {
    const mdpHashe = await bcrypt.hash(password, 12);
    const cleApi = crypto.randomUUID();
    await pool.query(
        'INSERT INTO bibliotheque (nom, courriel, cle_api, password) VALUES ($1, $2, $3, $4)',
        [nom, courriel, cleApi, mdpHashe]
    );
    return { cle_api: cleApi };
};

const getParCourriel = async (courriel) => {
    const result = await pool.query(
        'SELECT * FROM bibliotheque WHERE courriel = $1',
        [courriel]
    );
    return result.rows[0] || null;
};

const regenererCleApi = async (id) => {
    const cleApi = crypto.randomUUID();
    await pool.query(
        'UPDATE bibliotheque SET cle_api = $1 WHERE id = $2',
        [cleApi, id]
    );
    return cleApi;
};

export { validationCle, creerBibliotheque, getParCourriel, regenererCleApi };