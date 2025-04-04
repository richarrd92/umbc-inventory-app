import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from alembic import context
from logging.config import fileConfig
from database import Base  # Import Base from your database module

# Load environment variables from .env
load_dotenv()

# Fetch database URL
database_url = os.getenv("DATABASE_STRING")

# Ensure DATABASE_STRING is loaded
if not database_url:
    raise ValueError("DATABASE_STRING is not set in .env")

# Alembic config object
config = context.config

# Override sqlalchemy.url dynamically
config.set_main_option("sqlalchemy.url", database_url)

# Configure logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set metadata for autogeneration
target_metadata = Base.metadata

def run_migrations_offline():
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    context.configure(
        url=database_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    engine = create_engine(database_url)

    with engine.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
