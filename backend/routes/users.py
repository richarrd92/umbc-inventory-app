from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserResponse, UserCreate, UserUpdate
from typing import List
from sqlalchemy.exc import IntegrityError # Validates crud operations
from datetime import datetime 
from passlib.context import CryptContext # type: ignore


router = APIRouter(prefix="/users", tags=["Users"]) 
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Get All Users
@router.get("/", response_model=List[UserResponse]) 
def get_users(db: Session = Depends(get_db)):
    """
    This endpoint retrieves all active users from the database.
    It queries the 'User' table and returns the list of users.
    """
    return db.query(User).filter(User.deleted_at.is_(None)).all()

# Get a User by ID
@router.get("/{id}", response_model=UserResponse)
def get_user(id: int, db: Session = Depends(get_db)):
    """
    This endpoint retrieves a user from the database by their ID.
    It filters the 'User' table by the given ID and returns the user if found.
    If the user is not found, it raises a 404 error.
    """
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Create a User
@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    This endpoint creates a new user in the database using the provided data --> must be in json format (raw).
    It checks for any duplicate username errors and returns the created user.
    """

    # Check if the user already exists (ignoring soft-deleted users)
    existing_user = db.query(User).filter(
        (User.email == user.email) | (User.firebase_uid == user.firebase_uid),
        User.deleted_at == None  # Ensure the user is not soft deleted
    ).first()
    
    # If the user already exists, raise an error
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or Firebase UID already exists"
        )

    # Create a new user instance
    new_user = User(
        # username=user.username,
        firebase_uid=user.firebase_uid,
        email=user.email,
        name=user.name,
        role=user.role
    )
    
    # Add the new user to the database session and commit
    db.add(new_user)
    db.commit()
    
    # Refresh to get the newly created user with id and created_at
    db.refresh(new_user)
    
    # Return the newly created user as a response (using UserResponse schema)
    return new_user

# Update a User
@router.put("/{id}", response_model=UserResponse)
def update_user(id: int, user: UserUpdate, db: Session = Depends(get_db)):
    """
    This endpoint partially updates an existing user in the database.
    It only updates the fields provided in the request body.
    """
    db_user = db.query(User).filter(User.id == id, User.deleted_at == None).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update field(s) if provided
    if user.firebase_uid:
        db_user.firebase_uid = user.firebase_uid
    if user.email:
        db_user.email = user.email
    if user.name:
        db_user.name = user.name
    if user.role:
        db_user.role = user.role
    
    # Only hash and update the password if it's provided
    if user.password:
        # Hash the password before saving
        hashed_password = pwd_context.hash(user.password)
        db_user.password = hashed_password

    # Commit the changes to the database
    db.commit()
    db.refresh(db_user)

    return db_user

# restore a User (Restore Soft Deleted)
@router.put("/{id}/restore", response_model=UserResponse)
def restore_user(id: int, db: Session = Depends(get_db)):
    """
    This endpoint restores a soft-deleted user by setting the 'deleted_at' field to NULL.
    """
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if the user is already not soft deleted
    if user.deleted_at is None:
        raise HTTPException(status_code=400, detail="User is not deleted")

    # restore the user: Set 'deleted_at' to NULL
    user.deleted_at = None
    db.commit()
    db.refresh(user)

    return user

# Delete a User
@router.delete("/{id}")
def delete_user(id: int, db: Session = Depends(get_db)):
    """
    This endpoint marks a user as deleted instead of fully removing them
    It updates the 'deleted_at' timestamp instead of performing a hard delete
    """
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Soft delete: set deleted_at timestamp
    user.deleted_at = datetime.utcnow()
    db.commit()
    
    return {"message": "User soft deleted successfully"}