CREATE DATABASE IF NOT EXISTS `inventory-app`;
USE `inventory-app`;

----------------------------------------------------------------------------------------
----------------- BE CAREFUL RUN COMMAND TO RESET ALL TABLES IN TABLES -----------------

SET FOREIGN_KEY_CHECKS = 0; -- Temporarily disables foreign key constraints to avoid dependency errors.
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS transaction_items;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1; -- Re-enables foreign key constraints after tables are deleted.

----------------- BE CAREFUL RUN COMMAND TO RESET ALL TABLES IN TABLES -----------------
----------------------------------------------------------------------------------------


-- users table (stores both admins & students)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firebase_uid VARCHAR(255) UNIQUE NOT NULL,  -- Firebase UID (replaces username)
    email VARCHAR(255) UNIQUE NOT NULL,  -- Store user email (from Firebase)
    name VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin') NOT NULL,  -- defines what the user can do
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL, -- added for soft delete instead of full removal
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- added to track updates
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
    deleted_at TIMESTAMP NULL DEFAULT NULL, -- added for soft delete instead of full removal
    created_by_id INT, -- NEW: associate order with a user (admin)
    submitted_at TIMESTAMP NULL DEFAULT NULL, -- added to get time when order was submitted
    FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE SET NULL -- track who created it

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

USE `inventory-app`;

-- AI generated sample data part 1
INSERT INTO items (name, category, quantity, restock_threshold, user_id) VALUES
    ('Canned Black Beans', 'Canned Food', 60, 12, 1),
    ('Canned Corn', 'Canned Food', 65, 13, 2),
    ('Canned Peaches in Juice', 'Canned Food', 50, 10, 1),
    ('Canned Tuna in Water', 'Canned Food', 70, 14, 2),
    ('Apple Slices (Fresh)', 'Fresh Produce', 30, 6, 1),
    ('Mixed Fruit Cup', 'Fresh Produce', 25, 5, 2),
    ('Banana Bunch', 'Fresh Produce', 40, 8, 1),
    ('Bag of Baby Carrots', 'Fresh Produce', 35, 7, 2),
    ('Microwaveable Brown Rice', 'Grains & Pasta', 55, 11, 1),
    ('Boxed Whole Wheat Pasta', 'Grains & Pasta', 60, 12, 2),
    ('Instant Mashed Potatoes', 'Grains & Pasta', 50, 10, 1),
    ('Frozen Breakfast Burrito', 'Frozen Meals', 30, 6, 2),
    ('Frozen Vegetable Steamer Pack', 'Frozen Meals', 40, 8, 1),
    ('Frozen Mac & Cheese Bowl', 'Frozen Meals', 35, 7, 2),
    ('Peanut Butter (Jar)', 'Protein', 45, 9, 1),
    ('Nut Butter Snack Packs', 'Protein', 50, 10, 2),
    ('Protein Bar - Chocolate', 'Snacks', 70, 14, 1),
    ('Fruit Snacks', 'Snacks', 60, 12, 2),
    ('Cheddar Cheese Crackers', 'Snacks', 55, 11, 1),
    ('Shelf-Stable Milk (1L)', 'Dairy Alternatives', 40, 8, 2);


-- AI generated sample data part 2
INSERT INTO items (name, category, quantity, restock_threshold, user_id) VALUES
    ('Canned Green Beans', 'Canned Food', 60, 12, 1),
    ('Canned Chicken Breast', 'Canned Food', 50, 10, 2),
    ('Canned Pineapple Chunks', 'Canned Food', 45, 9, 1),
    ('Instant Oatmeal Packets - Maple Brown Sugar', 'Breakfast Items', 80, 16, 2),
    ('Boxed Cereal - Multigrain', 'Breakfast Items', 70, 14, 1),
    ('Shelf-Stable Scrambled Egg Pouch', 'Breakfast Items', 30, 6, 2),
    ('Microwavable Quinoa Bowl', 'Grains & Pasta', 40, 8, 1),
    ('Whole Wheat Tortillas (Pack)', 'Grains & Pasta', 35, 7, 2),
    ('Couscous Packets', 'Grains & Pasta', 50, 10, 1),
    ('Frozen Chicken Stir Fry', 'Frozen Meals', 30, 6, 2),
    ('Frozen Vegetable Fried Rice', 'Frozen Meals', 25, 5, 1),
    ('Frozen Turkey Meatballs', 'Frozen Meals', 28, 6, 2),
    ('Hard-Boiled Eggs (2-pack)', 'Protein', 20, 4, 1),
    ('Single-Serve Tuna Pack', 'Protein', 55, 11, 2),
    ('Black Bean Pouches', 'Protein', 50, 10, 1),
    ('Shelf-Stable Cheese Cups', 'Dairy Alternatives', 40, 8, 2),
    ('Almond Milk (Shelf-Stable)', 'Dairy Alternatives', 45, 9, 1),
    ('Yogurt Tubes (Refrigerated)', 'Dairy Alternatives', 30, 6, 2),
    ('Banana Chips', 'Snacks', 50, 10, 1),
    ('Granola Trail Mix Bars', 'Snacks', 65, 13, 2),
    ('Crackers and Peanut Butter Packs', 'Snacks', 70, 14, 1),
    ('Mandarin Orange Cups', 'Fresh Produce', 40, 8, 2),
    ('Bagged Grapes (Fresh)', 'Fresh Produce', 35, 7, 1),
    ('Mini Carrot Snack Bags', 'Fresh Produce', 45, 9, 2),
    ('100% Apple Juice Box', 'Beverages', 60, 12, 1);

