from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship
from database import Base # Base for model inheritance

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
