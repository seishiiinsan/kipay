-- Traduire les catégories existantes
UPDATE expenses SET category = 'Alimentation' WHERE category = 'food';
UPDATE expenses SET category = 'Transport' WHERE category = 'transport';
UPDATE expenses SET category = 'Logement' WHERE category = 'housing';
UPDATE expenses SET category = 'Loisirs' WHERE category = 'leisure';
UPDATE expenses SET category = 'Autre' WHERE category = 'other';

-- Changer la valeur par défaut
ALTER TABLE expenses ALTER COLUMN category SET DEFAULT 'Autre';
