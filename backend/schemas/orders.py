from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from schemas.items import ItemResponse 
from schemas.users import UserResponse

# base schema for an order item
class OrderItemBase(BaseModel):
    item_id: int
    suggested_quantity: int
    final_quantity: int
    supplier: Optional[str] = None

# schema for creating an order item
class OrderItemCreate(OrderItemBase):
    pass

# schema for returning an order item
class OrderItemResponse(OrderItemBase):
    id: int
    created_at: datetime
    deleted_at: Optional[datetime] = None  # soft delete tracking
    withdrawn_7d: Optional[int] = None
    item: Optional[ItemResponse] = None

    class Config:
        from_attributes = True

# base schema for an order
class OrderBase(BaseModel):
    pass  # no specific fields required for creating an order

# schema for creating an order
class OrderCreate(OrderBase):
    order_items: List[OrderItemCreate]  # must include order items when creating an order

# schema for returning an order
class OrderResponse(OrderBase):
    id: int
    created_at: datetime
    deleted_at: Optional[datetime] = None  # soft delete tracking
    submitted: bool  
    submitted_at: Optional[datetime] = None
    order_items: List[OrderItemResponse] # nested order items
    created_by_id: Optional[int] = None
    created_by: Optional[UserResponse] = None 

    class Config:
        from_attributes = True

class OrderItemUpdate(BaseModel):
    item_id: int
    final_quantity: int


OrderItemResponse.update_forward_refs()