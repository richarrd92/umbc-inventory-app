from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserResponse, UserCreate, UserUpdate
from typing import List
from sqlalchemy.exc import IntegrityError # Validates crud operations
from datetime import datetime 

router = APIRouter(prefix="/users", tags=["Users"]) 

# # Debug 
# @router.get("/")
# def test():
#     return {"message": "Working"}


# Use "/" instead of "/users" because the router is already prefixed with "/users"

# Get All Users
@router.get("/", response_model=List[UserResponse]) 
def get_users(db: Session = Depends(get_db)):
    """
    This endpoint retrieves all active users from the database.
    It queries the 'User' table and returns the list of users.
    """
    return db.query(User).filter(User.deleted_at.is_(None)).all()  # Use of `is_` instead of `==`

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
    try:
        # Create a new user instance using the data from the request body (UserCreate schema)
        new_user = User(
            username=user.username,
            name=user.name,
            password=user.password,
            role=user.role
        )
        
        # Add the new user to the database session and commit
        db.add(new_user)
        db.commit()
        
        # Refresh to get the newly created user with id and created_at
        db.refresh(new_user)
        
        # Return the newly created user as a response (using UserResponse schema)
        return new_user
    
    except IntegrityError as e:
        # If there's a unique constraint violation (e.g., duplicate username)
        db.rollback()  # Rollback the session to undo the transaction
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )

# Update a User
@router.put("/{id}", response_model=UserResponse)
<<<<<<< HEAD
def update_user(id: int, user: UserUpdate, db: Session = Depends(get_db)):
=======
def update_user(id: int, user: UserCreate, db: Session = Depends(get_db)):
>>>>>>> origin/main
    """
    This endpoint partially updates an existing user in the database.
    It only updates the fields provided in the request body.
    """
    db_user = db.query(User).filter(User.id == id, User.deleted_at == None).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Only update fields that were provided in the request
    for key, value in user.dict(exclude_unset=True).items():
        setattr(db_user, key, value)

    db.commit()
    db.refresh(db_user)

    return db_user

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
    
<<<<<<< HEAD
    return {"message": "User soft deleted successfully"}
=======
    return {"message": "User soft deleted successfully"}
>>>>>>> origin/main
