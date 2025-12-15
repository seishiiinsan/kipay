-- Création de la table d'activité
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL, -- Si l'user est supprimé, on garde l'activité (mais sans lien)
    type VARCHAR(50) NOT NULL, -- 'EXPENSE_CREATE', 'EXPENSE_UPDATE', 'EXPENSE_DELETE', 'PAYMENT', 'MEMBER_JOIN'
    details JSONB, -- Stocke les détails (montant, description, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour les performances
CREATE INDEX idx_activities_group_id ON activities(group_id);
