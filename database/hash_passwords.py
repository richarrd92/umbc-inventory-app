# script to create hashed passwords versions for old main.sql user input passwords

from passlib.context import CryptContext  # type: ignore

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

passwords = {
    'password123': hash_password('password123'),
    'securepass': hash_password('securepass'),
    'studentpass': hash_password('studentpass'),
    'wonderwoman': hash_password('wonderwoman'),
    'mi6agent': hash_password('mi6agent'),
}

for key, value in passwords.items():
    print(f"{key}: '{value}',")
