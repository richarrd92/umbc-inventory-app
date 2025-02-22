CREATE DATABASE IF NOT EXISTS inventory;
USE inventory;

-- users table (stores both admins & students)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,  -- student ID (XX#####) or "admin"
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL DEFAULT '1234',  -- default password for dummy login
    role ENUM('student', 'admin') NOT NULL,  -- defines what the user can do
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL  -- if admin is removed, set to NULL
);

-- transactions table (Logs inventory changes when any users take/add items)
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT, -- the item being taken/added
    user_id INT,  -- who did the transaction (either students or admins)
    quantity INT NOT NULL, -- the amount being taken/added
    transaction_type ENUM('IN', 'OUT') NOT NULL,  -- 'IN' = added, 'OUT' = taken
    notes TEXT NULL,  -- optional notes about transaction
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,  -- delete transactions if item is deleted
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE  -- delete transactions if user is deleted
);

-- orders table (stores table of orders generated for restocking inventory)
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- when that order was generated
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
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,  -- delete order items if order is deleted
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE  -- delete order items if item is deleted
);
