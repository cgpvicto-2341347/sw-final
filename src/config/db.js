import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

let params = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
};

if (process.env.DB_SSL) {
    params.ssl = { rejectUnauthorized: false };
}

const pool = new pg.Pool(params);

export default pool;