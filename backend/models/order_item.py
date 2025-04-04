from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship
from database import Base # Base for model inheritance

# Define the OrderItem model
class OrderItem(Base):
    __tablename__ = "order_items"  # Table name in the database

    id = Column(Integer, primary_key=True, autoincrement=True)  # Unique identifier for each order item entry
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)  # The order this item belongs to
    item_id = Column(Integer, ForeignKey("items.id", ondelete="SET NULL"), nullable=True)  # The item being ordered
    suggested_quantity = Column(Integer, nullable=False)  # Initial suggested quantity for the order
    final_quantity = Column(Integer, nullable=False)  # Final approved quantity (admin can modify)
    supplier = Column(String(255), nullable=True)  # Supplier name (if available)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())  # Timestamp when the order item was created
    deleted_at = Column(TIMESTAMP, nullable=True) # soft delete timestamp

    # Define relationships
    order = relationship("Order", back_populates="order_items")  # Reference to the related order
    item = relationship("Item", back_populates="order_items")  # Reference to the related item