# Import necessary SQLAlchemy modules for defining models
from sqlalchemy import Column, Integer, String, Enum, Text, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship
from database import Base, engine  # Base for model inheritance & engine for database connection

# Define the User model
class User(Base):
    __tablename__ = "users"  # Table name in the database

    id = Column(Integer, primary_key=True, autoincrement=True)  # Unique identifier for each user
    username = Column(String(50), unique=True, nullable=False)  # Student ID or "admin"
    name = Column(String(255), nullable=False)  # Full name of the user
    password = Column(String(255), nullable=False, default='1234')  # Default password for initial login
    role = Column(Enum('student', 'admin', name='user_roles'), nullable=False)  # User role (defines access rights)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())  # Timestamp when the user was created

    # Define relationships
    items_added = relationship("Item", back_populates="added_by", cascade="all, delete")  # Items added by the admin
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete")  # User's transactions

# Define the Item model
class Item(Base):
    __tablename__ = "items"  # Table name in the database

    id = Column(Integer, primary_key=True, autoincrement=True)  # Unique identifier for each item
    name = Column(String(255), nullable=False)  # Name of the item
    category = Column(String(100))  # Category of the item
    quantity = Column(Integer, nullable=False, default=0)  # Current stock level
    restock_threshold = Column(Integer, default=5)  # Stock level that triggers restocking alerts
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Admin who added the item
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())  # Timestamp when the item was added

    # Define relationships
    added_by = relationship("User", back_populates="items_added")  # Admin who added the item
    transactions = relationship("Transaction", back_populates="item", cascade="all, delete")  # Transactions involving this item
    order_items = relationship("OrderItem", back_populates="item", cascade="all, delete")  # Order items associated with this item

# Define the Transaction model
class Transaction(Base):
    __tablename__ = "transactions"  # Table name in the database

    id = Column(Integer, primary_key=True, autoincrement=True)  # Unique identifier for each transaction
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False)  # The item involved in the transaction
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # User who performed the transaction
    quantity = Column(Integer, nullable=False)  # Quantity of the item taken or added
    transaction_type = Column(Enum('IN', 'OUT', name='transaction_types'), nullable=False)  # 'IN' = added, 'OUT' = taken
    notes = Column(Text, nullable=True)  # Optional notes about the transaction
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())  # Timestamp when the transaction occurred
    
    # Define relationships
    item = relationship("Item", back_populates="transactions")  # Reference to the related item
    user = relationship("User", back_populates="transactions")  # Reference to the user who made the transaction

# Define the Order model
class Order(Base):
    __tablename__ = "orders"  # Table name in the database

    id = Column(Integer, primary_key=True, autoincrement=True)  # Unique identifier for each order
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())  # Timestamp when the order was created

    # Define relationships
    order_items = relationship("OrderItem", back_populates="order", cascade="all, delete")  # Items within this order

# Define the OrderItem model
class OrderItem(Base):
    __tablename__ = "order_items"  # Table name in the database

    id = Column(Integer, primary_key=True, autoincrement=True)  # Unique identifier for each order item entry
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)  # The order this item belongs to
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False)  # The item being ordered
    suggested_quantity = Column(Integer, nullable=False)  # Initial suggested quantity for the order
    final_quantity = Column(Integer, nullable=False)  # Final approved quantity (admin can modify)
    supplier = Column(String(255), nullable=True)  # Supplier name (if available)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())  # Timestamp when the order item was created

    # Define relationships
    order = relationship("Order", back_populates="order_items")  # Reference to the related order
    item = relationship("Item", back_populates="order_items")  # Reference to the related item

# Create tables in the database if this script is executed directly
if __name__ == "__main__":
    Base.metadata.create_all(engine)  # Generate database tables if they do not exist
