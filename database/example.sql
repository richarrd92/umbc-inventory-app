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

-- insert test transactions (IN = added, OUT = taken)
INSERT INTO transactions (item_id, user_id, quantity, transaction_type, notes) VALUES
    (1, 3, 1, 'OUT', 'Sandwich given to student'),
    (2, 4, 1, 'OUT', 'Fruit pack given to student'),
    (3, 5, 2, 'OUT', 'Bottled water distributed'),
    (4, 3, 3, 'OUT', 'Granola bars provided for snack'),
    (5, 4, 1, 'OUT', 'Salad given for lunch');

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
SELECT * FROM orders;
SELECT * FROM order_items;
