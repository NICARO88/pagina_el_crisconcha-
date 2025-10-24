#config.py
import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()  # Cargar variables de entorno desde .env

class Settings:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///data.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "change-me")
    FRONT_ORIGIN = os.getenv("FRONT_ORIGIN", "http://localhost:5173")

    # SMTP para enviar correo (ajústalo a tu proveedor)
    SMTP_HOST = os.getenv("SMTP_HOST", "")
    SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER = os.getenv("SMTP_USER", "")
    SMTP_PASS = os.getenv("SMTP_PASS", "")
    MAIL_TO   = os.getenv("MAIL_TO", "contacto@elcrisconcha.com")  # destinatario


    