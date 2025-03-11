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
    username: str = Field(..., max_length=50)
    name: str = Field(..., max_length=255)
    role: UserRole

# Schema for user creation (expects password)
# extends/inherites from UserBase
# password must be minimum 4 in length
class UserCreate(UserBase):
    password: str = Field(..., min_length=4, max_length=255)

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
    username: str | None = Field(None, max_length=50)
    name: str | None = Field(None, max_length=255)
    password: str | None = Field(None, min_length=4, max_length=255)
    role: UserRole | None = None
