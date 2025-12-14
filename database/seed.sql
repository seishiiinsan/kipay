-- Nettoyage complet
TRUNCATE users, groups, group_members, expenses, expense_participants, payments RESTART IDENTITY CASCADE;

-- 1. Utilisateurs (Mot de passe pour tous : 'password123')
INSERT INTO users (name, email, password)
VALUES ('Gabin Admin', 'gabin@kipay.app', '$2a$10$yW.3.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q'),     -- ID 1
       ('Alice Martin', 'alice@test.com', '$2a$10$yW.3.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q'),     -- ID 2
       ('Bob Dupont', 'bob@test.com', '$2a$10$yW.3.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q'),         -- ID 3
       ('Charlie Durand', 'charlie@test.com', '$2a$10$yW.3.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q'), -- ID 4
       ('David Lefebvre', 'david@test.com', '$2a$10$yW.3.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q.q');
-- ID 5

-- 2. Groupes
INSERT INTO groups (name, created_by_user_id)
VALUES ('Vacances Ski 2024', 1), -- ID 1
       ('Colocation Paris', 2),  -- ID 2
       ('Cadeau Maman', 3);
-- ID 3

-- 3. Membres des groupes
-- Groupe Ski : Gabin, Alice, Bob, Charlie
INSERT INTO group_members (group_id, user_id)
VALUES (1, 1),
       (1, 2),
       (1, 3),
       (1, 4);

-- Groupe Coloc : Alice, Bob
INSERT INTO group_members (group_id, user_id)
VALUES (2, 2),
       (2, 3);

-- Groupe Cadeau : Bob, Charlie, David
INSERT INTO group_members (group_id, user_id)
VALUES (3, 3),
       (3, 4),
       (3, 5);


-- 4. Dépenses (Groupe Ski)
-- Gabin a payé la location du chalet (1000€) pour tout le monde
INSERT INTO expenses (description, amount, date, group_id, paid_by_user_id)
VALUES ('Location Chalet', 1000.00, '2024-01-10', 1, 1); -- ID 1

INSERT INTO expense_participants (expense_id, user_id, amount_owed)
VALUES (1, 1, 250.00),
       (1, 2, 250.00),
       (1, 3, 250.00),
       (1, 4, 250.00);

-- Alice a payé les courses (200€) pour tout le monde
INSERT INTO expenses (description, amount, date, group_id, paid_by_user_id)
VALUES ('Courses Supermarché', 200.00, '2024-01-11', 1, 2); -- ID 2

INSERT INTO expense_participants (expense_id, user_id, amount_owed)
VALUES (2, 1, 50.00),
       (2, 2, 50.00),
       (2, 3, 50.00),
       (2, 4, 50.00);

-- Bob a payé les forfaits (300€) mais seulement pour lui et Charlie
INSERT INTO expenses (description, amount, date, group_id, paid_by_user_id)
VALUES ('Forfaits Ski', 300.00, '2024-01-12', 1, 3); -- ID 3

INSERT INTO expense_participants (expense_id, user_id, amount_owed)
VALUES (3, 3, 150.00),
       (3, 4, 150.00);


-- 5. Dépenses (Groupe Coloc)
-- Alice a payé l'électricité (80€)
INSERT INTO expenses (description, amount, date, group_id, paid_by_user_id)
VALUES ('Facture EDF', 80.00, '2024-02-01', 2, 2); -- ID 4

INSERT INTO expense_participants (expense_id, user_id, amount_owed)
VALUES (4, 2, 40.00),
       (4, 3, 40.00);


-- 6. Remboursements
-- Charlie rembourse Gabin pour sa part du chalet (250€)
INSERT INTO payments (amount, date, group_id, paid_by_user_id, paid_to_user_id)
VALUES (250.00, '2024-01-20', 1, 4, 1);

-- Bob rembourse une partie à Alice (20€)
INSERT INTO payments (amount, date, group_id, paid_by_user_id, paid_to_user_id)
VALUES (20.00, '2024-02-05', 2, 3, 2);
