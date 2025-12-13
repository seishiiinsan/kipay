-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Groups Table
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_by_user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Group Members Junction Table
CREATE TABLE group_members (
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (group_id, user_id)
);

-- Expenses Table
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    date DATE NOT NULL,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    paid_by_user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Expense Participants Table (to handle splits)
CREATE TABLE expense_participants (
    id SERIAL PRIMARY KEY,
    expense_id INTEGER REFERENCES expenses(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    amount_owed NUMERIC(10, 2) NOT NULL,
    is_settled BOOLEAN DEFAULT FALSE
);

-- Payments Table (for settlements)
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    amount NUMERIC(10, 2) NOT NULL,
    date DATE NOT NULL,
    group_id INTEGER REFERENCES groups(id),
    paid_by_user_id INTEGER REFERENCES users(id),
    paid_to_user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faster queries
CREATE INDEX idx_group_members_user_id ON group_members(user_id);
CREATE INDEX idx_expenses_group_id ON expenses(group_id);
CREATE INDEX idx_expense_participants_user_id ON expense_participants(user_id);

-- Sample data for testing
INSERT INTO users (name, email) VALUES
('Alice', 'alice@example.com'),
('Bob', 'bob@example.com'),
('Charlie', 'charlie@example.com');

INSERT INTO groups (name, created_by_user_id) VALUES
('Trip to Paris', 1);

INSERT INTO group_members (group_id, user_id) VALUES
(1, 1),
(1, 2),
(1, 3);

-- Alice paid 90 for the hotel
INSERT INTO expenses (description, amount, date, group_id, paid_by_user_id) VALUES
('Hotel', 90.00, '2024-05-20', 1, 1);

-- The hotel cost is split equally (30 each)
INSERT INTO expense_participants (expense_id, user_id, amount_owed) VALUES
(1, 1, 30.00),
(1, 2, 30.00),
(1, 3, 30.00);

-- Bob paid 30 for the restaurant, but only for him and Charlie
INSERT INTO expenses (description, amount, date, group_id, paid_by_user_id) VALUES
('Restaurant', 30.00, '2024-05-20', 1, 2);

-- The restaurant cost is split between Bob and Charlie (15 each)
INSERT INTO expense_participants (expense_id, user_id, amount_owed) VALUES
(2, 2, 15.00),
(2, 3, 15.00);
