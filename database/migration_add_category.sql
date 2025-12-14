-- Ajouter la colonne category
ALTER TABLE expenses ADD COLUMN category VARCHAR(50) DEFAULT 'other';

-- Mettre à jour les anciennes dépenses avec des catégories aléatoires pour tester
UPDATE expenses SET category = CASE floor(random() * 5)::int
    WHEN 0 THEN 'food'
    WHEN 1 THEN 'transport'
    WHEN 2 THEN 'housing'
    WHEN 3 THEN 'leisure'
    ELSE 'other'
END;
