-- Ajouter les colonnes pour la vérification d'email
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN verification_token VARCHAR(255);

-- Pour les utilisateurs existants, on considère qu'ils sont vérifiés pour ne pas bloquer tout le monde
UPDATE users SET email_verified = TRUE;
