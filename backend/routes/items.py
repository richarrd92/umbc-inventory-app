from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
from schemas import ItemResponse  # Import Pydantic schemas

router = APIRouter(prefix="/items", tags=["Items"])

# Get all items
@router.get("/", response_model=list[ItemResponse])
def get_items(db: Session = Depends(get_db)):
    """
    This endpoint retrieves all active items from the database.
    It queries the database and returns the list of items as a response.
    """
    return db.query(models.Item).filter(models.Item.deleted_at == None).all()

# Get a single item by ID
@router.get("/{item_id}", response_model=ItemResponse)
def get_item(item_id: int, db: Session = Depends(get_db)):
    """
    This endpoint retrieves a single item by its ID from the database.
    If the item is found, it returns the item. If not, it raises a 404 error indicating 
    that the item was not found.
    """
    db_item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_item


"""
Checkpoint --->
Other endpoints to be implemented later 
ie: create_item, update_item, delete_item
"""