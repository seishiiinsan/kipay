-- Ajouter la colonne pour les couleurs d'avatar
-- On stockera l'ID de la palette (ex: 'palette1', 'palette2') ou directement le tableau JSON
ALTER TABLE users ADD COLUMN avatar_palette VARCHAR(50) DEFAULT 'default';
