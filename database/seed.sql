-- Nettoyage des données existantes
TRUNCATE users, groups, group_members, expenses, expense_participants, payments RESTART IDENTITY CASCADE;

-- 1. Création de 50 utilisateurs
INSERT INTO users (name, email)
SELECT
    'User ' || s,
    'user' || s || '@kipay.app'
FROM generate_series(1, 50) as s;

-- 2. Création de 10 groupes
INSERT INTO groups (name, created_by_user_id)
SELECT
    'Groupe ' || s,
    (floor(random() * 50) + 1)::int
FROM generate_series(1, 10) as s;

-- 3. Ajout des membres aux groupes
-- On s'assure d'abord que le créateur est membre
INSERT INTO group_members (group_id, user_id)
SELECT id, created_by_user_id FROM groups ON CONFLICT DO NOTHING;

-- On ajoute des membres aléatoires (environ 20% de chance pour chaque user d'être dans chaque groupe)
INSERT INTO group_members (group_id, user_id)
SELECT
    g.id,
    u.id
FROM groups g
CROSS JOIN users u
WHERE random() < 0.2
ON CONFLICT DO NOTHING;

-- 4. Création de 500 dépenses
-- Pour chaque dépense, on choisit un groupe et un payeur membre de ce groupe
INSERT INTO expenses (description, amount, date, group_id, paid_by_user_id)
SELECT
    'Dépense ' || s,
    (random() * 100 + 5)::numeric(10,2), -- Montant entre 5 et 105
    CURRENT_DATE - (floor(random() * 365) || ' days')::interval, -- Date aléatoire sur la dernière année
    rp.group_id,
    rp.user_id
FROM generate_series(1, 500) s
CROSS JOIN LATERAL (
    SELECT group_id, user_id
    FROM group_members
    ORDER BY random()
    LIMIT 1
) rp;

-- 5. Création des participants aux dépenses
-- On divise chaque dépense équitablement entre tous les membres du groupe
INSERT INTO expense_participants (expense_id, user_id, amount_owed)
SELECT
    e.id,
    gm.user_id,
    (e.amount / count(*) OVER (PARTITION BY e.id))::numeric(10,2)
FROM expenses e
JOIN group_members gm ON e.group_id = gm.group_id;

-- 6. Création de 100 remboursements
INSERT INTO payments (amount, date, group_id, paid_by_user_id, paid_to_user_id)
SELECT
    (random() * 50 + 5)::numeric(10,2),
    CURRENT_DATE - (floor(random() * 365) || ' days')::interval,
    rp.group_id,
    rp.payer_id,
    rp.payee_id
FROM generate_series(1, 100) s
CROSS JOIN LATERAL (
    SELECT
        gm1.group_id,
        gm1.user_id as payer_id,
        gm2.user_id as payee_id
    FROM group_members gm1
    JOIN group_members gm2 ON gm1.group_id = gm2.group_id
    WHERE gm1.user_id != gm2.user_id -- On ne se rembourse pas soi-même
    ORDER BY random()
    LIMIT 1
) rp;
