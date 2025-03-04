from sqlalchemy import Column, Integer, Enum, Text, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship
from database import Base # Base for model inheritance

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