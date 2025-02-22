# Backend Server Setup Guide
This guide provides instructions for setting up and running the backend server for this project. The backend is implemented using Python using Flask framework.

## Backend Structure
To maintain a clean structure, files are organized as follows:
```
backend_project/
│── database.py
│── models.py
│── main.py
│── dependencies.txt
│── .env
```
- `database.py`: Manages database connection
- `models.py`: Defines database tables (creates table if it doesnt exit)
- `main.py`: Entry point for running the backend
- `dependencies.txt`: Lists all dependencies
- `.env`: Stores environment variables securely (e.g., database URL)

## Prerequisites

Before starting, ensure you have the following installed:
- **Python3** (recommended: latest stable version)
- **Virtual environment (`venv`) module:** `python3.12 -m venv venv`
- **Generate dependencies.txt** `pip freeze > dependencies.txt`
- **Install dependencies from dependencies.txt** `pip install -r dependencies.txt`

**Note:** Python 3.13 is an unstable, and many third-party packages (like uvicorn) may not yet support it. Using Python 3.12 for the virtual environment ensures better compatibility. T

## Setup Instructions

- Open a terminal and move to the backend directory: `cd backend`
- Create a new virtual environment with Python 3.12 explicitly: `python3.12 -m venv venv`
- To activate the virtual environment, in terminal run: `source venv/bin/activate`
- If this is your first time setting up the backend, install the required dependencies, in terminal run: `pip install -r dependencies.txt`
- Once all dependencies are installed, start the backend server by running: `python3 main.py`
- Access API at: http://127.0.0.1:8000

## Key Libraries and Their Purpose:

- **FastAPI:** High-performance API framework for building web applications.
- **Uvicorn:** ASGI server for running FastAPI applications efficiently.
- **SQLAlchemy:** Object-relational mapper (ORM) for database management.
- **Pydantic:** Data validation and settings management using Python type hints.
- **bcrypt:** Secure password hashing for authentication.
- **PyJWT:** JSON Web Token (JWT) implementation for secure authentication.
- **PyMySQL:** MySQL database adapter for connecting and managing MySQL databases.
- **requests:** Library for making HTTP requests in Python.
- **httpx:** Async HTTP client for making API calls.
- **argon2-cffi:** Implementation of Argon2 password hashing for security.
- **cryptography:** Library for encryption and cryptographic operations.
- **python-dotenv:** Loads environment variables from a `.env` file.

## API Endpoints Documentation:  

### Current Checkpoint:  
- Research API documentation libraries and frameworks.  
- Document each API route with the following details:  
  - **Method:** HTTP method (GET, POST, PUT, DELETE).  
  - **Endpoint:** URL pattern (e.g., `/users/{id}`).  
  - **Headers:** Optional request headers (e.g., `Content-Type`).  
  - **Parameters:** Query and path parameters.  
  - **Request Body:** Required data for POST/PUT requests.  
  - **Response Format:** Expected success and error responses.  
- Implement API endpoints to handle CRUD (Create, Read, Update, Delete) operations for each model and specific functionalities like authentication or transactions


### Common CRUD Operations and Functionalities:

#### User Endpoints
- **Create a User**: `POST /users`
- **Get All Users**: `GET /users`
- **Get a User by ID**: `GET /users/{id}`
- **Update a User**: `PUT /users/{id}`
- **Delete a User**: `DELETE /users/{id}`
- **User Login**: `POST /auth/login`

#### Item Endpoints
- **Create an Item**: `POST /items`
- **Get All Items**: `GET /items`
- **Get an Item by ID**: `GET /items/{id}`
- **Update an Item**: `PUT /items/{id}`
- **Delete an Item**: `DELETE /items/{id}`

#### Transaction Endpoints
- **Create a Transaction**: `POST /transactions`
- **Get All Transactions**: `GET /transactions`
- **Get a Transaction by ID**: `GET /transactions/{id}`
- **Update a Transaction**: `PUT /transactions/{id}`
- **Delete a Transaction**: `DELETE /transactions/{id}`

#### Order Endpoints
- **Create an Order**: `POST /orders`
- **Get All Orders**: `GET /orders`
- **Get an Order by ID**: `GET /orders/{id}`
- **Delete an Order**: `DELETE /orders/{id}`

#### Order Item Endpoints
- **Add an Item to an Order**: `POST /orders/{order_id}/items`
- **Get Items in an Order**: `GET /orders/{order_id}/items`
- **Update an Order Item**: `PUT /order_items/{id}`
- **Delete an Order Item**: `DELETE /order_items/{id}`



