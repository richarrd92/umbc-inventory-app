from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # Import CORS middleware
from sqlalchemy.orm import Session
from models import Item, User, Transaction, Order, OrderItem # Import model tables
from database import get_db
import bcrypt # type: ignore 


# Initialize FastAPI application
app = FastAPI()

# Enable CORS - offers protection of api routes (waiting on the front-end developer)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:###"],  # Adjust to frontend URL (### -> PORT NUMBER)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)


# Landing page (http://127.0.0.1:8000/)
@app.get("/")
def read_root():
    """Returns a welcome message."""
    return {"message": "Welcome to the UMBC Inventory App Home Root API"}


# Run the FastAPI app when executed directly
if __name__ == "__main__":
    import uvicorn  # ASGI server for running FastAPI # type: ignore 
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

# Notes:
# - The API will be accessible at http://127.0.0.1:8000
# - The "reload=True" option allows automatic reloading when code changes.
# - This script sets up routes for managing Items, Users, Transactions, Orders, OrderItems etc