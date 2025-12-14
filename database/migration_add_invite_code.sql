-- Ajouter la colonne invite_code
ALTER TABLE groups ADD COLUMN invite_code VARCHAR(20) UNIQUE;

-- Générer des codes aléatoires pour les groupes existants (pour éviter les NULL)
UPDATE groups
SET invite_code = UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6))
WHERE invite_code IS NULL;

-- Rendre la colonne obligatoire pour les futurs enregistrements
ALTER TABLE groups ALTER COLUMN invite_code SET NOT NULL;
