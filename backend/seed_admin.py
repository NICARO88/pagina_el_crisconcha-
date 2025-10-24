from app import app, db
from models import User
import bcrypt

email = "elcrisconcha@gmail.com"
password = "crisconchita666"

with app.app_context():
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    user = User(email=email, password_hash=hashed, is_admin=True)
    db.session.add(user)
    db.session.commit()
    print(f"✅ Usuario admin creado: {email}")
