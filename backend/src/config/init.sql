-- Script d'initialisation de la base de données BiblioThèque
-- Exécuter avec : psql -U postgres -d bibliotheque -f init.sql

CREATE TABLE IF NOT EXISTS livres (
  id SERIAL PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  auteur VARCHAR(255) NOT NULL,
  isbn VARCHAR(20) UNIQUE,
  annee_publication INTEGER,
  genre VARCHAR(100),
  description TEXT,
  disponible BOOLEAN DEFAULT TRUE,
  date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS emprunts (
  id SERIAL PRIMARY KEY,
  livre_id INTEGER NOT NULL REFERENCES livres(id) ON DELETE RESTRICT,
  emprunteur_nom VARCHAR(255) NOT NULL,
  date_emprunt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_retour_prevue TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '14 days'),
  date_retour TIMESTAMP
);

-- Index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_livres_disponible ON livres(disponible);
CREATE INDEX IF NOT EXISTS idx_livres_genre ON livres(genre);
CREATE INDEX IF NOT EXISTS idx_emprunts_livre ON emprunts(livre_id);
CREATE INDEX IF NOT EXISTS idx_emprunts_retour ON emprunts(date_retour);

-- Données de démonstration
INSERT INTO livres (titre, auteur, isbn, annee_publication, genre, description) VALUES
  ('L''Alchimiste', 'Paulo Coelho', '978-2-2460-0381-9', 1988, 'Roman', 'L''histoire d''un berger andalou qui voyage vers les pyramides d''Égypte.'),
  ('Le Petit Prince', 'Antoine de Saint-Exupéry', '978-2-0706-1275-8', 1943, 'Roman', 'Un conte poétique et philosophique sous l''apparence d''un conte pour enfants.'),
  ('Introduction aux algorithmes', 'Cormen et al.', '978-0-2620-3384-8', 2009, 'Informatique', 'La référence mondiale sur les algorithmes et structures de données.'),
  ('Sapiens', 'Yuval Noah Harari', '978-2-2260-2560-6', 2015, 'Histoire', 'Une brève histoire de l''humanité depuis l''âge de pierre jusqu''au XXIe siècle.'),
  ('L''Art de la Guerre', 'Sun Tzu', '978-2-0803-7079-7', -500, 'Philosophie', 'Traité de stratégie militaire et de philosophie chinoise classique.')
ON CONFLICT DO NOTHING;
