from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Base schema (shared attributes)
class TransactionBase(BaseModel):
    item_id: int
    user_id: Optional[int] = None
    quantity: int
    transaction_type: str  # 'IN' or 'OUT'
    notes: Optional[str] = None

# Schema for creating a transaction
class TransactionCreate(TransactionBase):
    pass  # Inherits all attributes from TransactionBase

# Schema for updating a transaction
class TransactionUpdate(BaseModel):
    item_id: Optional[int] = None
    user_id: Optional[int] = None
    quantity: Optional[int] = None
    transaction_type: Optional[str] = None
    notes: Optional[str] = None

# Schema for returning a transaction
class TransactionResponse(TransactionBase):
    id: int
    created_at: datetime
    deleted_at: Optional[datetime] = None  # Soft delete tracking

    class Config:
        from_attributes = True  # Enables ORM mode
