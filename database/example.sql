-- This file is for inserting example data into the inventory database.

USE inventory;

-- insert test users (admins & students)
INSERT INTO users (username, name, password, role) VALUES


-- insert test inventory items (must link to an admin ID)
INSERT INTO items (name, category, quantity, restock_threshold, user_id) VALUES


-- insert test transactions (IN = added, OUT = taken)
INSERT INTO transactions (item_id, user_id, quantity, transaction_type, notes) VALUES


-- insert test orders (you must create an order before order_items)
INSERT INTO orders (created_at) VALUES


-- insert order items (must reference an existing order & item)
INSERT INTO order_items (order_id, item_id, suggested_quantity, final_quantity, supplier) VALUES

