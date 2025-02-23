# Import necessary libraries
from sqlalchemy import create_engine, text  # Database engine and raw SQL execution 
from sqlalchemy.ext.declarative import declarative_base  # ORM base class 
from sqlalchemy.orm import sessionmaker  # Session management 
from dotenv import load_dotenv  # Load environment variables from .env file 
import os  # OS module to access environment variables

# Load environment variables from a .env file
load_dotenv()

# Read the database connection string from environment variables
# This keeps credentials secure and avoids hardcoding database details in the source code
DATABASE_URL = os.getenv("DATABASE_STRING")

# ================================
# ERROR HANDLING REQUIRED - WILL IMPLEMENT LATER
# - Ensure DATABASE_URL is not None or empty  
# - Validate that DATABASE_URL follows the expected format  
# - Log meaningful error messages if validation fails  eg {"message" : "Make sure .env is created."}
# - Exit the program gracefully if an invalid or missing connection string is detected 
# ================================


# Create a database engine
# The engine manages the connection and interacts with the database
engine = create_engine(DATABASE_URL)

# Create a session factory for handling database transactions
# - `autocommit=False`: Changes require explicit commits to database
# - `autoflush=False`: Prevents automatic flushing (writing) of pending changes to database
# - `bind=engine`: Links the session to our database engine
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Define the base class for ORM models
# All database models will inherit from this class
Base = declarative_base()

# Automatically create tables in the database if they do not exist
print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("Tables created successfully!")

# Dependency function to get a database session
# Used in frameworks like FastAPI to inject a session into routes
def get_db():
    db = SessionLocal()  # Create a new session
    try:
        yield db  # Provide the session to the caller
    finally:
        db.close()  # Ensure session is closed after use

# Function to test the database connection
def test_db_connection():
    try:
        # Establish a connection and execute a simple query
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))  # Executes a test query
            print("Database connection successful:", result.scalar())  # Expecting 1 as output
    except Exception as e:
        print("Database connection failed:", e)  # Print error if connection fails

# Run the database connection test on script execution
test_db_connection()
