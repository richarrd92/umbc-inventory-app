from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from database import get_db
import models
from schemas import TransactionCreate, TransactionResponse, TransactionUpdate
from datetime import datetime

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

# Create a new transaction
@router.post("/", response_model=TransactionResponse)
def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    """
    Creates a new transaction in the database.
    """
    try:
        new_transaction = models.Transaction(**transaction.dict())
        db.add(new_transaction)
        db.commit()
        db.refresh(new_transaction)
        return new_transaction
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Database integrity error: Invalid entry or constraint violation.")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

# restore a deleted transaction
@router.put("/{transaction_id}/restore")
def restore_transaction(transaction_id: int, db: Session = Depends(get_db)):
    """
    Restores a previously soft-deleted transaction.
    """
    transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    if transaction.deleted_at is None:
        raise HTTPException(status_code=400, detail="Transaction is not deleted")

    transaction.deleted_at = None  # Restore transaction
    db.commit()

    return {"message": "Transaction restored successfully"}

# Update a transaction
@router.put("/{transaction_id}", response_model=TransactionResponse)
def update_transaction(transaction_id: int, transaction_data: TransactionUpdate, db: Session = Depends(get_db)):
    """
    Updates an existing transaction (if not deleted).
    """
    transaction = db.query(models.Transaction).filter(
        models.Transaction.id == transaction_id,
        models.Transaction.deleted_at == None
    ).first()

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found or deleted")

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
