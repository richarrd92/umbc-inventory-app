from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship
from database import Base # Base for model inheritance

# Define the Order model
class Order(Base):
    __tablename__ = "orders"  # Table name in the database

    id = Column(Integer, primary_key=True, autoincrement=True)  # Unique identifier for each order
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())  # Timestamp when the order was created
    deleted_at = Column(TIMESTAMP, nullable=True) # soft delete timestamp

    # Define relationships
    order_items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan") # Items within this order