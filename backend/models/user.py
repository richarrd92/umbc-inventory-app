# Import necessary SQLAlchemy modules for defining models
from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP, func
from sqlalchemy.orm import relationship
from database import Base # Base for model inheritance

# Define the User model
class User(Base):
    __tablename__ = "users"  # Table name in the database

    id = Column(Integer, primary_key=True, autoincrement=True)  # Unique identifier for each user
    # username = Column(String(50), unique=True, nullable=False)  # Student ID or "admin"
    firebase_uid = Column(String(255), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)  # Email associated with the Firebase account
    name = Column(String(255), nullable=False)  # Full name of the user
    # password = Column(String(255), nullable=False, default='1234')  # Default password for initial login
    role = Column(Enum('student', 'admin', name='user_roles'), nullable=False)  # User role (defines access rights)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())  # Timestamp when the user was created
    deleted_at = Column(TIMESTAMP, nullable=True)  # Soft delete timestamp
    updated_at = Column(TIMESTAMP, default=func.current_timestamp(), onupdate=func.current_timestamp())  # Track updates

    # Define relationships
    items_added = relationship("Item", back_populates="added_by", passive_deletes=True)  # Keep items, but make FKs null
    transactions = relationship("Transaction", back_populates="user", passive_deletes=True)  # User's transactions - keep transaction history
    orders = relationship("Order", back_populates="created_by", passive_deletes=True)
