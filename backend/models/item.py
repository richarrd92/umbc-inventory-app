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
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)  # user who added item - preserve data even if user is deleted
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())  # Timestamp when the item was added
    deleted_at = Column(TIMESTAMP, nullable=True)  # soft delete timestamp

    # Define relationships
    added_by = relationship("User", back_populates="items_added")  # Admin who added the item
    transactions = relationship("Transaction", back_populates="item", passive_deletes=True) # Transactions involving this item - no cascade to keep history
    order_items = relationship("OrderItem", back_populates="item", passive_deletes=True) # Order items associated with this item - keep order history
