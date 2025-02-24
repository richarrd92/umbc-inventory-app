# Import necessary libraries
from sqlalchemy import create_engine, text  # Database engine and raw SQL execution 
# from sqlalchemy.ext.declarative import declarative_base  # ORM base class ---> Depreciated function
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker  # Session management 
from dotenv import load_dotenv  # Load environment variables from .env file 
import os  # module to access environment variables
import sys # provides access to system-specific parameters and functions
from sqlalchemy.exc import OperationalError  # Handles database connection errors

print("\n-------- STARTING DATABASE CONNECTION --------")
print()

# Check if .env file exists
# Ensures the application does not proceed if the required .env file is missing
if not os.path.isfile(".env"):
    print({"error message: ": "Make sure .env is created."}, file=sys.stderr)
    sys.exit(1) # graceful exit

# Load environment variables from a .env file
# This allows the program to use configuration settings without hardcoding them
load_dotenv()

# Read the database connection string from environment variables
# This keeps credentials secure and avoids hardcoding database details in the source code
DATABASE_URL = os.getenv("DATABASE_STRING")

# Validate that the database connection string is set
# Prevents the application from running with an invalid or missing database configuration
if not DATABASE_URL:
    print({"error message: " : "DATABASE_STRING is not set in .env."}, file=sys.stderr)
    sys.exit(1) # graceful exit

# Confirm successful loading of environment variables
print("Environment file loaded successfully.")


# Create a database engine
# The engine manages the connection and interacts with the database
try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        print("Database connection established.")
except OperationalError :
    print({"error message: " : "Database connection failed. Check database connection url" }, file=sys.stderr)
    sys.exit(1)  # Graceful exit

# all other cases possibly not related to database connection url
except Exception:
    print({"error message: " : "Unexpected error while connecting to the database."}, file=sys.stderr)
    sys.exit(1)  # Graceful exit


# Create a session factory for handling database transactions
# - `autocommit=False`: Changes require explicit commits to database
# - `autoflush=False`: Prevents automatic flushing (writing) of pending changes to database
# - `bind=engine`: Links the session to our database engine
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Define the base class for ORM models
# All database models will inherit from this class
Base = declarative_base()

# Ensure Base is initialized correctly
if Base is None:
    print({"error message: ": "Failed to initialize database base class."}, file=sys.stderr)
    sys.exit(1)  # Graceful exit if Base is None

# Automatically create tables in the database if they do not exist
try:
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")
except Exception:
    print({"error message: ": "Failed to create database tables."}, file=sys.stderr)
    sys.exit(1)  # Graceful exit

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
            print("\n-------- DATABASE CONNECTED --------")
            print()
    except Exception:
        print({"error message: ": "Database connection failed:"})  # Print error if connection fails

# Run the database connection test on script execution
test_db_connection()
