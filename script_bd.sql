-- =========================================
-- SCRIPT : Gestion de bibliothèque
-- =========================================

DROP TABLE IF EXISTS prets;
DROP TABLE IF EXISTS livres;
DROP TABLE IF EXISTS bibliotheque;

CREATE TABLE bibliotheque(
	id SERIAL PRIMARY KEY,
	nom VARCHAR(100) NOT NULL,
	courriel VARCHAR(255) NOT NULL UNIQUE,
	cle_api VARCHAR(36) NOT NULL UNIQUE,
	password VARCHAR(100) NOT NULL
);

CREATE TABLE livres(
	id SERIAL PRIMARY KEY,
	bibliotheque_id INTEGER NOT NULL,
	titre VARCHAR(100) NOT NULL,
	auteur VARCHAR(100) NOT NULL,
	isbn VARCHAR(20),
	date_ajout DATE NOT NULL DEFAULT CURRENT_DATE,
	disponible BOOLEAN NOT NULL DEFAULT TRUE,
	FOREIGN KEY (bibliotheque_id) REFERENCES bibliotheque(id) ON DELETE CASCADE
);

CREATE TABLE prets(
	id SERIAL PRIMARY KEY,
	livre_id INTEGER NOT NULL,
	emprunteur VARCHAR(100) NOT NULL,
	date_emprunt DATE NOT NULL DEFAULT CURRENT_DATE,
	date_retour_prevue DATE NOT NULL,
	date_retour_reelle DATE,
	statut VARCHAR(20) NOT NULL DEFAULT 'EN_COURS' CHECK (statut IN ('EN_COURS','RETOURNE')),
	FOREIGN KEY (livre_id) REFERENCES livres(id) ON DELETE CASCADE
);

INSERT INTO bibliotheque(nom,courriel,cle_api,password) VALUES
('Biblio Centrale','central@mail.com','82f49f8a-a6f9-4abf-a641-5bb89fec30d8','pass123'),
('Biblio Nord','nord@mail.com','08ce6b81-c791-444c-8a12-24c918c770b3','pass456');

INSERT INTO livres(bibliotheque_id,titre,auteur,isbn) VALUES
(1,'Le Petit Prince','Antoine de Saint-Exupery','123456789'),
(1,'1984','George Orwell','987654321'),
(2,'L''Etranger','Albert Camus','456123789');

INSERT INTO prets(livre_id,emprunteur,date_retour_prevue,statut) VALUES
(2,'Ben','2026-05-01','EN_COURS'),
(1,'la joie','2020-06-12','EN_COURS');

select * from bibliotheque;