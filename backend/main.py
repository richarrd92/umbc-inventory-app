from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # Import CORS middleware
from routes import items, users, orders, transactions, auth # Import route modules

# Initialize FastAPI application
app = FastAPI()

# Enable CORS - offers protection of api routes ***** (waiting on the Front-end side) *****
# Helps connect the frontend and backend APIs 
# Frontend and backend will be hosted on different domains or port 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Adjust to frontend URL (### -> PORT NUMBER)
    allow_credentials=True, # Allows frontend requests to include credentials like cookies, authentication tokens, or session data.
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Register API routes
app.include_router(items.router) 
app.include_router(users.router)
app.include_router(orders.router)
app.include_router(transactions.router) 
app.include_router(auth.router) 



# Landing page (http://127.0.0.1:8000/)
@app.get("/")
def read_root():
    """Returns a welcome message."""
    return {"Welcome to the UMBC Inventory App Home Root API"}


# Run the FastAPI app when executed directly
if __name__ == "__main__":
    import uvicorn  # ASGI server for running FastAPI # type: ignore 
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

# Notes:
# - The API will be accessible at http://127.0.0.1:8000
# - The "reload=True" option allows automatic reloading when code changes.
# - This script sets up routes for managing Items, Users, Transactions, Orders, OrderItems etc