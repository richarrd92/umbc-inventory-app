from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from database import get_db
import models
from schemas import TransactionCreate, TransactionResponse, TransactionUpdate

router = APIRouter(prefix="/transactions", tags=["Transactions"])

# Get all transactions
@router.get("/", response_model=list[TransactionResponse])
def get_transactions(db: Session = Depends(get_db)):
    """
    Retrieves all transactions that are not deleted.
    """
    return db.query(models.Transaction).filter(models.Transaction.deleted_at == None).all()

# Get a single transaction by ID
@router.get("/{transaction_id}", response_model=TransactionResponse)
def get_transaction(transaction_id: int, db: Session = Depends(get_db)):
    """
    Retrieves a single transaction if it is not deleted.
    """
    transaction = db.query(models.Transaction).filter(
        models.Transaction.id == transaction_id,
        models.Transaction.deleted_at == None
    ).first()
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    return transaction

# create a transaction
@router.post("/", response_model=TransactionResponse)
def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    """
    Creates a new transaction in the database.
    """
    try:
        # Create the transaction
        new_transaction = models.Transaction(
            user_id=transaction.user_id,
            transaction_type=transaction.transaction_type,
            notes=transaction.notes,
        )
        db.add(new_transaction)
        db.commit()
        db.refresh(new_transaction)

        # create associated transaction items and adjust inventory
        items = []
        for item_data in transaction.transaction_items:
            # Fetch the corresponding item
            item = db.query(models.Item).filter(models.Item.id == item_data.item_id).first()
            if not item:
                raise HTTPException(status_code=404, detail=f"Item with ID {item_data.item_id} not found")

            # OUT transaction: subtract from inventory
            if transaction.transaction_type == "OUT":
                if item.quantity < item_data.quantity:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Not enough stock for item ID {item_data.item_id}. Available: {item.quantity}, Requested: {item_data.quantity}"
                    )
                item.quantity -= item_data.quantity

            # IN transaction: add to inventory
            elif transaction.transaction_type == "IN":
                item.quantity += item_data.quantity

            # Create transaction item
            ti = models.TransactionItem(
                transaction_id=new_transaction.id,
                item_id=item_data.item_id,
                quantity=item_data.quantity,
            )
            items.append(ti)

        db.add_all(items)
        db.commit()
        db.refresh(new_transaction)

        return new_transaction

    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Database integrity error.")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")



# restore a deleted transaction
@router.put("/{transaction_id}/restore")
def restore_transaction(transaction_id: int, db: Session = Depends(get_db)):
    """
    Restores a previously soft-deleted transaction and adjusts inventory.
    """
    transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    if transaction.deleted_at is None:
        raise HTTPException(status_code=400, detail="Transaction is not deleted")

    # Re-adjust inventory based on transaction type
    for t_item in transaction.transaction_items:
        item = db.query(models.Item).filter(models.Item.id == t_item.item_id).first()
        if not item:
            continue

        if transaction.transaction_type == "OUT":
            if item.quantity < t_item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Cannot restore. Item ID {item.id} would drop below 0 stock."
                )
            item.quantity -= t_item.quantity
        elif transaction.transaction_type == "IN":
            item.quantity += t_item.quantity

    transaction.deleted_at = None
    db.commit()
    return {"message": "Transaction restored successfully"}


# Update a transaction
@router.put("/{transaction_id}", response_model=TransactionResponse)
def update_transaction(transaction_id: int, transaction_data: TransactionUpdate, db: Session = Depends(get_db)):
    """
    Updates an existing transaction (if not deleted). Adjusts inventory if transaction type changes.
    """
    transaction = db.query(models.Transaction).filter(
        models.Transaction.id == transaction_id,
        models.Transaction.deleted_at == None
    ).first()

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found or deleted")

    # If transaction type is changing -->reverse old one and apply the new one
    if transaction_data.transaction_type and transaction_data.transaction_type != transaction.transaction_type:
        for t_item in transaction.transaction_items:
            item = db.query(models.Item).filter(models.Item.id == t_item.item_id).first()
            if not item:
                continue

            # undo previous effect
            if transaction.transaction_type == "OUT":
                item.quantity += t_item.quantity
            elif transaction.transaction_type == "IN":
                if item.quantity < t_item.quantity:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Cannot update. Changing to 'OUT' would drop stock of item ID {item.id} below 0."
                    )
                item.quantity -= t_item.quantity

        # apply new type
        for key, value in transaction_data.dict(exclude_unset=True).items():
            setattr(transaction, key, value)

    else:
        # If type didn’t change, just update the other metadata
        for key, value in transaction_data.dict(exclude_unset=True).items():
            setattr(transaction, key, value)

    db.commit()
    db.refresh(transaction)
    return transaction

# Delete a transaction
@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    """
    Soft deletes a transaction by setting the deleted_at timestamp instead of removing it.
    """
    transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    transaction.deleted_at = datetime.utcnow()  # Mark as deleted
    db.commit()
    
    return {"message": "Transaction marked as deleted"}
