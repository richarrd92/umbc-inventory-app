from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from models import User
from schemas import LoginRequest, LoginResponse
from database import get_db
from passlib.context import CryptContext # type: ignore

# Initialize password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Verify Password
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Login Route
@router.post("/login", response_model=LoginResponse)
def login_user(login: LoginRequest, db: Session = Depends(get_db)):
    # Log the incoming request for debugging
    print(f"Login attempt with username: {login.username} and password: {login.password}")
    
    # Query the user by username
    user = db.query(User).filter(User.username == login.username, User.deleted_at.is_(None)).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
    
    # Check if the password matches (assuming the password is hashed in the database)
    if not verify_password(login.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
    
    # Return token and role
    return {"token": f"mock-token-{user.username}", "role": user.role}


# Logout Route  
@router.post("/logout")
def logout_user():
    """
    This endpoint handles user logout.
    It requires the frontend to delete the stored token in their localStorage or cookies.
    """
    return {"message": "User logged out successfully. Please clear the token on the client-side."}
