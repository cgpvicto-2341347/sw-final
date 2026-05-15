import express from 'express';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import cors from 'cors';

import bibliothequeRoute from './src/routes/bibliotheque.route.js'
import livresRoute from './src/routes/livres.route.js'
import pretRoute from './src/routes/prets.route.js'

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerDocument = JSON.parse(fs.readFileSync('./src/config/documentation.json', 'utf8'));
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "API Bibliothèques"
};

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

const logStream = fs.createWriteStream('./errors.log', { flags: 'a' });
app.use(morgan('combined', {
    skip: (req, res) => res.statusCode < 500,
    stream: logStream
}));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

app.use('/api/bibliotheques', bibliothequeRoute);
app.use('/api/livres', livresRoute);
app.use('/api/prets', pretRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));