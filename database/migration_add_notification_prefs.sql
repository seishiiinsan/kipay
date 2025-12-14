-- Ajouter les colonnes de préférences de notification
ALTER TABLE users ADD COLUMN notify_new_expense BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN notify_debt_reminder BOOLEAN DEFAULT FALSE;
