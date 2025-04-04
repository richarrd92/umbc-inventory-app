
-- This file is for inserting example data into the inventory database.

USE inventory;

-- insert test users (admins & students) 
INSERT INTO users (username, name, password, role) VALUES
    ('admin1', 'Alice Johnson', 'password123', 'admin'),
    ('admin2', 'Bob Smith', 'securepass', 'admin'),
    ('s12345', 'Charlie Brown', 'studentpass', 'student'),
    ('s67890', 'Diana Prince', 'wonderwoman', 'student'),
    ('s11223', 'Ethan Hunt', 'mi6agent', 'student');

-- insert test inventory items (must link to an admin ID)
INSERT INTO items (name, category, quantity, restock_threshold, user_id) VALUES
    ('Sandwiches', 'Food', 50, 10, 1),
    ('Fruit Packs', 'Food', 30, 5, 2),
    ('Bottled Water', 'Beverages', 100, 20, 1),
    ('Granola Bars', 'Food', 75, 15, 2),
    ('Salads', 'Food', 25, 5, 1);

-- insert test transactions (create a checkout group)
INSERT INTO transactions (user_id, transaction_type, notes) VALUES
    (3, 'OUT', 'Charlie took snacks and drinks'),
    (4, 'OUT', 'Diana picked up food items');

-- insert transaction items (link to transaction_id and item_id)
INSERT INTO transaction_items (transaction_id, item_id, quantity) VALUES
    (1, 1, 1),  -- Sandwich
    (1, 3, 1),  -- Bottled Water
    (1, 4, 2),  -- Granola Bars
    (2, 2, 1),  -- Fruit Pack
    (2, 5, 1);  -- Salad

-- insert test orders (you must create an order before order_items)
INSERT INTO orders (created_at) VALUES
    ('2024-02-01 10:30:00'),
    ('2024-02-05 14:15:00');

-- insert order items (must reference an existing order & item)
INSERT INTO order_items (order_id, item_id, suggested_quantity, final_quantity, supplier) VALUES
    (1, 1, 50, 50, 'FoodBank Co.'),
    (1, 3, 100, 100, 'WaterSupply Inc.'),
    (2, 2, 30, 30, 'FreshFarms Ltd.'),
    (2, 4, 75, 75, 'SnackDistributors');


SELECT * FROM users;
SELECT * FROM items;
SELECT * FROM transactions;
SELECT * FROM transaction_items;
SELECT * FROM orders;
SELECT * FROM order_items;
