# Import necessary SQLAlchemy modules for defining models
from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP, func
from sqlalchemy.orm import relationship
from database import Base # Base for model inheritance

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