### Backend Structure

This guide provides instructions for setting up and running the backend server for this project. The backend is implemented using Python using FastAPI framework. To maintain a clean structure, files are organized as follows:

```
backend/
│── /alembic
│── |── /versions
│   ├── env.py
│   ├── script.py.mako
│── /models
│   ├── __init__.py
│   ├── auth.py
│   ├── user.py
│   ├── item.py
│   ├── transaction.py
│   ├── order.py
│── /routes
│   ├── __init__.py
│   ├── users.py
│   ├── items.py
│   ├── transactions.py
│   ├── orders.py
│── /schemas
│   ├── __init__.py
│   ├── auth.py
│   ├── user.py
│   ├── item.py
│   ├── transaction.py
│   ├── order.py
│── database.py
│── main.py
│── dependencies.txt
│── .env
│── alembic.ini
│── /venv
│── /tests
│   ├── endpoint-documentation.md
│   ├── user-endpoints.json
│   ├── item-endpoints.json
│   ├── transaction-endpoints.json
```

### File Descriptions

- `database.py`: Manages the database connection using SQLAlchemy. Handles session creation and ensures tables are initialized.
- `main.py`: Entry point for running the backend. Initializes the FastAPI server, loads routes, and sets up middleware if needed.
- `models/`: Contains database models representing different entities.
  - `__init__.py`: Marks this directory as a package, enabling imports between modules.
  - `auth.py`: Defines the `Auth` model, including attributes like ID, username, password etc.
  - `user.py`: Defines the `User` model, including attributes like ID, name, username, password etc.
  - `item.py`: Defines the `Item` model, including attributes like ID, name, category, quantity etc.
  - `transaction.py`: Defines the `Transaction` model, which tracks item purchases, linking users and items.
  - `order.py`: Defines the `Order` model, managing user orders and their associated transactions.
- `routes/`: Contains API route files.
  - `__init__.py`: Enables this directory to be recognized as a module, allowing for structured route imports.
  - `users.py`: Handles user-related operations like registration, authentication, and profile management.
  - `items.py`: Manages item-related endpoints such as listing, creating, deleting, and updating items.
  - `transactions.py`: Handles transaction-related API requests, such as purchasing items.
  - `orders.py`: Provides endpoints for managing orders, including order creation and retrieval.
- `schemas/`: Defines Pydantic models for data validation.
  - `__init__.py`: Ensures this directory is treated as a package, facilitating imports across the application.
  - `auth.py`: Defines schemas for authentication-related API interactions.
  - `user.py`: Defines schemas for user-related API interactions.
  - `item.py`: Defines schemas for item-related API interactions.
  - `transaction.py`: Specifies validation rules for transaction-related data.
  - `order.py`: Contains schemas for order-related endpoints.
- `dependencies.txt`: Lists all dependencies
- `.env`: Stores environment variables securely (e.g., database URL)
- `alembic.ini`: Configuration file for Alembic, a database migration tool
- `/venv`: Virtual environment for dependency management
- `/alembic`: Directory for database migration scripts
- `/tests`: Directory for endpoint test files

### Prerequisites

Before starting, ensure you have the following installed:

- **Python3** (recommended: latest stable version)
- **Virtual environment (`venv`) module:** `python3.12 -m venv venv`
- **Install dependencies from dependencies.txt** `pip install -r dependencies.txt`
pip freeze > dependencies.txt


**Note:** Python 3.13 is unstable, and many third-party packages (like uvicorn) may not yet support it. Using Python 3.12 for the virtual environment ensures better compatibility.

### Setup Instructions

- Open a terminal and move to the backend directory: `cd backend`
- If this is your first time setting up the backend, create a new virtual environment with Python 3.12 explicitly: `python3.12 -m venv venv`
- To activate the virtual environment, in terminal run: `source venv/bin/activate`
- If this is your first time setting up the backend, install the required dependencies, in terminal run: `pip install -r dependencies.txt`
- Ensure that the .env file exists in the backend directory. If not, create it and add the database connection string: `echo 'DATABASE_STRING="mysql+pymysql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>/<DB_NAME>"' >> .env`
- Replace <DB_USER>, <DB_PASSWORD>, <DB_HOST>, and <DB_NAME> with the appropriate credentials.
- Initialize the database tables before running the backend by executing: `python3 database.py`
- Once all dependencies are installed and the database is set up, start the backend server by running: `python3 main.py`
- Access API at: http://127.0.0.1:8000
- Should display: `["Welcome to the UMBC Inventory App Home Root API"]`

### Key Libraries and Their Purpose:

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

### API Endpoints Documentation:

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
