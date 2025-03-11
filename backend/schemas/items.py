from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Base schema (item shared attributes)
class ItemBase(BaseModel):
    name: str 
    category: Optional[str] = None
    quantity: int
    restock_threshold: int

# schema for creating an item
class ItemCreate(ItemBase):
    pass  # inherits all attributes from ItemBase 

# schema for returning an item
class ItemResponse(ItemBase):
    id: int
    user_id: Optional[int] = None
    created_at: datetime
    deleted_at: Optional[datetime] = None  # add soft delete tracking

    class Config:
        from_attributes = True  # This allows ORM mode
