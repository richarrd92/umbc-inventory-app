from pydantic import BaseModel

# LoginRequest schema expects the Firebase ID token instead of username and password
class LoginRequest(BaseModel):
    id_token: str  # Firebase ID token passed from the frontend

class LoginResponse(BaseModel):
    token: str   # Firebase ID token 
    role: str    # Role of the user (student/admin)
    id: int      # The user's database ID
