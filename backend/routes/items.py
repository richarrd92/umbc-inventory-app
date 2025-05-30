from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from database import get_db
import models
from schemas import ItemResponse, ItemCreate, ItemUpdate  # Import Pydantic schemas
from datetime import datetime 

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

# Create a new item
@router.post("/", response_model=ItemResponse)
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    """
    This endpoint creates a new item in the database.
    It takes the item data as input and adds it to the database.
    """
    try:
        # Check if an active item with the same name and category already exists
        existing_item = (
            db.query(models.Item)
            .filter(
                models.Item.name == item.name,
                models.Item.category == item.category,
                models.Item.deleted_at.is_(None)  # ignore soft-deleted items
            )
            .first()
        )

        # item with same name exits
        if existing_item:
            raise HTTPException(status_code=400, detail="Item with this name and category already exists")

        # Create new item
        new_item = models.Item(**item.dict(exclude_unset=True))
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        return new_item
    
    # Handle database integrity errors
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Database integrity error: Duplicate entry or foreign key constraint violation."
        )

    # Handle other exceptions
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )

# Update Item
@router.put("/{item_id}", response_model=ItemResponse)
def update_item(item_id: int, item: ItemUpdate, db: Session = Depends(get_db)):
    """
    This endpoint updates an existing item in the database.
    It takes the item ID and the updated item data as input.
    """
    db_item = db.query(models.Item).filter(
        models.Item.id == item_id,
        models.Item.deleted_at.is_(None) 
    ).first()

    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")

    # Determine the new name and category
    new_name = item.name if item.name is not None else db_item.name
    new_category = item.category if item.category is not None else db_item.category

    # Check for duplicates excluding current item and soft-deleted items
    duplicate = db.query(models.Item).filter(
        models.Item.name == new_name,
        models.Item.category == new_category,
        models.Item.id != item_id,
        models.Item.deleted_at.is_(None) 
    ).first()

    if duplicate:
        raise HTTPException(
            status_code=400,
            detail="An item with the same name and category already exists."
        )

    # Update only the fields provided
    item_data = item.dict(exclude_unset=True)
    for key, value in item_data.items():
        setattr(db_item, key, value)

    db.commit()
    db.refresh(db_item)
    return db_item

# Delete an Item
@router.delete("/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    """
    This endpoint marks an item as deleted instead of fully removing it.
    It updates the 'deleted_at' timestamp instead of performing a hard delete.
    """
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    # Soft delete: set deleted_at timestamp 
    item.deleted_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Item soft deleted successfully"}