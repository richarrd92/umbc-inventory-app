from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Order, OrderItem
from schemas.orders import OrderCreate, OrderResponse
from datetime import datetime
from typing import List

router = APIRouter(prefix="/orders", tags=["Orders"])

# create a new order
@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    """
    Creates a new order along with its associated order items
    """
    # create the order first
    new_order = Order()
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    # add order items to the order
    order_items = [
        OrderItem(
            order_id=new_order.id,
            item_id=item.item_id,
            suggested_quantity=item.suggested_quantity,
            final_quantity=item.final_quantity,
            supplier=item.supplier
        )
        for item in order_data.order_items
    ]

    db.add_all(order_items)
    db.commit()

    # refresh to load relationships
    db.refresh(new_order)

    return new_order

# get all active orders
@router.get("/", response_model=List[OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    """
    Retrieves all orders that have not been soft deleted.
    """
    return db.query(Order).filter(Order.deleted_at == None).all()

# Get a single order by ID
@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    """
    Retrieves a single order by ID.
    """
    order = db.query(Order).filter(Order.id == order_id, Order.deleted_at == None).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

# soft delete an order
@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    """
    Marks an order as deleted instead of fully removing it.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.deleted_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Order soft deleted successfully"}