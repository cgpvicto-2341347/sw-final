const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const swaggerDocument = JSON.parse(fs.readFileSync('./src/config/documentation.json', 'utf8'));
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "API Bibliothèques"
};

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(__dirname + '/public'));

// Journal des erreurs 500
const logStream = fs.createWriteStream(path.join(__dirname, 'errors.log'), { flags: 'a' });
app.use(morgan('combined', {
    skip: (req, res) => res.statusCode < 500,
    stream: logStream
}));

// Documentation 
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

// Routes
app.use('/api/bibliotheques', require('./src/routes/bibliotheque.route'));
app.use('/api/livres',        require('./src/routes/livres.route'));
app.use('/api/prets',         require('./src/routes/prets.route'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));