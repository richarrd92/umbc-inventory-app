from fastapi import APIRouter, Depends, HTTPException, status
from firebase_admin import auth  # type: ignore
from sqlalchemy.orm import Session
from models import User
from database import get_db
from schemas import LoginRequest, LoginResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Verify Firebase ID Token
def verify_firebase_token(id_token: str):
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token  # Returns Firebase UID and email
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

# Login Route
@router.post("/login", response_model=LoginResponse)
def login_user(login: LoginRequest, db: Session = Depends(get_db)):
    decoded_token = verify_firebase_token(login.id_token)

    firebase_uid = decoded_token['uid']
    email = decoded_token['email']

    # Fetch user from the database using the Firebase UID
    user = db.query(User).filter(User.firebase_uid == firebase_uid).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Return token and role
    return {"token": login.id_token, "role": user.role, "id": user.id}

# Logout Route
@router.post("/logout")
def logout_user():
    """
    This endpoint handles user logout.
    It requires the frontend to delete the stored token in their localStorage or cookies.
    """
    return {"message": "User logged out successfully. Please clear the token on the client-side."}
