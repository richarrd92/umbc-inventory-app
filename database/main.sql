CREATE DATABASE IF NOT EXISTS inventory;
USE inventory;

----------------- BE CAREFUL RUN COMMAND TO RESET ALL TABLES IN TABLES 

SET FOREIGN_KEY_CHECKS = 0; -- Temporarily disables foreign key constraints to avoid dependency errors.
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS transaction_items;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1; -- Re-enables foreign key constraints after tables are deleted.

----------------- BE CAREFUL RUN COMMAND TO RESET ALL TABLES IN TABLES 

-- users table (stores both admins & students)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,  -- student ID (XX#####) or "admin"
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL DEFAULT '1234',  -- default password for dummy login
    role ENUM('student', 'admin') NOT NULL,  -- defines what the user can do
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL -- added for soft delete instead of full removal
);

-- inventory items table (main table- current inventory in stock)
CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    quantity INT NOT NULL DEFAULT 0, -- current stock level
    restock_threshold INT DEFAULT 5,  -- alerts when stock is low (5 for now)
    user_id INT,  -- tracks which admin added the item
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL, -- added for soft delete instead of full removal
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL  -- Updated: prevents full deletion of related data
);

-- transactions table (logs the checkout event)
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY, -- unique ID for the transaction
    user_id INT, -- the user (student/admin) who made the transaction
    transaction_type ENUM('IN', 'OUT') NOT NULL, -- OUT = item taken (student), IN = item added (admin/restock)
    notes TEXT NULL, -- optional notes (e.g., "picked up snacks")
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL -- keeps transaction if user is deleted
);

-- transaction items table (logs each item in a transaction)
CREATE TABLE transaction_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT, -- links back to the parent transaction
    item_id INT, -- the item being checked out
    quantity INT NOT NULL, -- how many of that item were taken or added
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE, -- delete items if parent transaction is deleted
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE SET NULL -- keep historical data even if item is removed
);

-- orders table (stores table of orders generated for restocking inventory)
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    submitted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- when that order was generated
    deleted_at TIMESTAMP NULL DEFAULT NULL -- added for soft delete instead of full removal
);

-- order items table (Tracks individual items within an order when order is generated)
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,  -- links to the order this item belongs to
    item_id INT,  -- the item being
    suggested_quantity INT NOT NULL,  -- initial suggested amount
    final_quantity INT NOT NULL,  -- editable quantity (admin updates this)
    supplier VARCHAR(255),  -- supplier name (if known)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL, -- added for soft delete instead of full removal
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,  -- delete order items if order is deleted
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE SET NULL -- Updated: Retains historical order data even if item is deleted
);


-- inserting example data into the inventory database.
USE inventory;

-- insert test users (admins & students) 
INSERT INTO users (username, name, password, role) VALUES
    ('admin1', 'Alice Johnson', '$2b$12$aPoomzd32szKwxrwRdX7puecpHgdSY0LiBP4t5GfIWcziRnn01jFK', 'admin'),
    ('admin2', 'Bob Smith', '$2b$12$9NJwjbrCvEvWPQXH8/eS.Oa9Uae9VxNpq2GST8Py6CabUAnh/C4/C', 'admin'),
    ('s12345', 'Charlie Brown', '$2b$12$KW9ZfnTnZ.GkWo8ZV8kLyOmocbl0xyQdHbocF7TYPSmX1kA2OXnc2', 'student'),
    ('s67890', 'Diana Prince', '$2b$12$iWbOYQjErFWtB1Wx7V6z0u.1wSCqFP2k9.zcDL9Z6T4VRmt0ySI/u', 'student'),
    ('s11223', 'Ethan Hunt', '$2b$12$SfAGmCQqBFmo7Bj1sSO9dOFuZ1fVz//Qfs24dmZBQSjDCaZXAMw/e', 'student');

-- insert test inventory items (must link to an admin ID)
INSERT INTO items (name, category, quantity, restock_threshold, user_id) VALUES
    ('Sandwiches', 'Food', 50, 10, 1),
    ('Fruit Packs', 'Food', 30, 5, 2),
    ('Bottled Water', 'Beverages', 100, 20, 1),
    ('Granola Bars', 'Food', 75, 15, 2),
    ('Salads', 'Food', 25, 5, 1);

-- insert test transactions (checkout event)
INSERT INTO transactions (user_id, transaction_type, notes) VALUES
    (3, 'OUT', 'Charlie took snacks and drinks'),
    (4, 'OUT', 'Diana picked up food items');

-- insert transaction items (must reference an existing transaction and item)
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
