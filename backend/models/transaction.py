from sqlalchemy import Column, Integer, Enum, Text, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship
from database import Base # Base for model inheritance

# Define the Transaction model (represents the overall checkout)
class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    transaction_type = Column(Enum('IN', 'OUT', name='transaction_types'), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    # Relationships
    user = relationship("User", back_populates="transactions")  # Who made the transaction
    items = relationship("TransactionItem", back_populates="transaction", cascade="all, delete")  # All items in this transaction