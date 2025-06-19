from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext
'''''
# Tajni ključ za potpisivanje JWT
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Vreme trajanja tokena u minutama

# Korišćenje CryptContext za šifrovanje lozinki
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Funkcija za hashovanje lozinke
def hash_password(password: str):
    return pwd_context.hash(password)

# Funkcija za verifikaciju lozinke
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# Funkcija za kreiranje JWT tokena
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
    '''