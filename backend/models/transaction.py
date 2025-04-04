from sqlalchemy import Column, Integer, Enum, Text, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship
from database import Base # Base for model inheritance

# Define the Transaction model (represents the overall checkout)
class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, autoincrement=True)  # Unique identifier for each transaction
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)  # User who performed the transaction - keep transaction history
    transaction_type = Column(Enum('IN', 'OUT', name='transaction_types'), nullable=False)  # 'IN' = added, 'OUT' = taken
    notes = Column(Text, nullable=True)  # Optional notes about the transaction
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())  # Timestamp when the transaction occurred
    deleted_at = Column(TIMESTAMP, nullable=True)  # Soft delete timestamp


    # Define relationships
    user = relationship("User", back_populates="transactions", passive_deletes=True)  # Reference to the user who made the transaction
    transaction_items = relationship("TransactionItem", back_populates="transaction", cascade="all, delete-orphan")