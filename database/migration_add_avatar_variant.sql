-- Ajouter la colonne pour le style d'avatar
ALTER TABLE users ADD COLUMN avatar_variant VARCHAR(20) DEFAULT 'beam';
