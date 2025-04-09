from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum
from datetime import datetime

# Define UserRole 
# users can either be student or admin
class UserRole(str, Enum):
    student = "student"
    admin = "admin"

# Base schema (user shared attributes)
# attributes shared btn admins and students
# calls userRole Enum
class UserBase(BaseModel):
    # username: str = Field(..., max_length=50)
    firebase_uid: str = Field(..., max_length=255)  # Firebase UID
    email: str = Field(..., max_length=255)  # User email
    name: str = Field(..., max_length=255)
    role: UserRole

# Schema for user creation (expects password)
# extends/inherites from UserBase
# password must be minimum 4 in length
class UserCreate(UserBase):
    # password: str = Field(..., min_length=4, max_length=255)
    pass

# Schema for user response (excludes password)
# extends/inherites from UserBase
# does not include passwords for security purposes
class UserResponse(UserBase):
    id: int
    created_at: datetime
    deleted_at: Optional[datetime] = None  # add soft delete tracking

    class Config:
        from_attributes = True  # Enables ORM mode for SQLAlchemy models

# Schema for updating user
# user can update 0 to any field necassary
class UserUpdate(BaseModel):
    name: Optional[str] = None
    # username: Optional[str] = None
    firebase_uid: Optional[str] = None  # Can be updated if necessary
    email: Optional[str] = None  # Optional update for email
    role: Optional[str] = None
    password: Optional[str] = None