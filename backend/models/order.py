from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, func, Boolean
from sqlalchemy.orm import relationship
from database import Base # Base for model inheritance

# Define the Order model
class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, autoincrement=True)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    deleted_at = Column(TIMESTAMP, nullable=True)
    submitted_at = Column(TIMESTAMP, nullable=True)
    submitted = Column(Boolean, default=False)

    # Foreign key to User
    created_by_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_by = relationship("User", back_populates="orders")  # Use 'orders' on User side

    order_items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")