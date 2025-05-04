from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .items import ItemResponse
from .users import UserResponse

# transaction items nested inside transactions
class TransactionItemBase(BaseModel):
    item_id: int
    quantity: int

class TransactionItemCreate(TransactionItemBase):
    pass

class TransactionItemResponse(TransactionItemBase):
    id: int
    created_at: datetime
    deleted_at: Optional[datetime] = None
    item: Optional[ItemResponse]

    class Config:
        from_attributes = True

# Base schema for the transaction
class TransactionBase(BaseModel):
    user_id: Optional[int] = None
    transaction_type: str  # 'IN' or 'OUT'
    notes: Optional[str] = None

# Creating a transaction with nested items
class TransactionCreate(TransactionBase):
    transaction_items: List[TransactionItemCreate]

# Updating transaction metadata only
class TransactionUpdate(BaseModel):
    user_id: Optional[int] = None
    transaction_type: Optional[str] = None
    notes: Optional[str] = None

# Returning a transaction with its nested items
class TransactionResponse(TransactionBase):
    id: int
    created_at: datetime
    deleted_at: Optional[datetime] = None
    transaction_items: List[TransactionItemResponse]
    user: Optional[UserResponse]

    class Config:
        from_attributes = True