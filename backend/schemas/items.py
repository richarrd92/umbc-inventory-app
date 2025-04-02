from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Base schema (item shared attributes)
class ItemBase(BaseModel):
    name: str 
    category: Optional[str] = None
    quantity: int = 0  # Ensures default matches DB (NOT NULL DEFAULT 0)
    restock_threshold: int = 5  # Matches DB default (DEFAULT 5)

# schema for creating an item
class ItemCreate(ItemBase):
    user_id: Optional[int] = None  # Ensure user_id is part of the schema
    # inherits all attributes from ItemBase 

# schema for returning an item
class ItemResponse(ItemBase):
    id: int
    user_id: Optional[int] = None
    created_at: datetime
    deleted_at: Optional[datetime] = None  # add soft delete tracking

    class Config:
        from_attributes = True  # This allows ORM mode

# schema for updating an item
class ItemUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[int] = None
    restock_threshold: Optional[int] = None
    user_id: Optional[int] = None

    class Config:
        from_attributes = True