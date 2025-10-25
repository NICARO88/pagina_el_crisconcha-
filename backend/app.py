# app.py
import os
from datetime import date, datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_talisman import Talisman
from dotenv import load_dotenv
from config import Settings
from models import db, Lead, Event, User
from admin import init_admin
from mailer import send_new_lead
from flask import session, redirect, url_for, render_template_string
from flask_login import LoginManager, login_user, logout_user, current_user, login_required
from flask_wtf import CSRFProtect
import bcrypt
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired, Email

class AdminLoginForm(FlaskForm):
    email = StringField("Email", validators=[DataRequired(), Email()])
    password = PasswordField("Password", validators=[DataRequired()])

load_dotenv()  # carga .env
settings = Settings()

app = Flask(__name__)
app.config.from_object(settings)

app.config["SESSION_PERMANENT"] = False


# Seguridad HTTP (ajusta Talisman para dev/prod)
csp = {
    "default-src": "'self'",
    "img-src": "'self' data: https:",
    "style-src": "'self' 'unsafe-inline' https:",
    "script-src": "'self' https:",
}
if app.debug:
    Talisman(app, content_security_policy=csp, force_https=False)
else:
    Talisman(app, content_security_policy=csp, force_https=True)

# CORS (en prod, limita a tu dominio)
CORS(app, resources={r"/api/*": {"origins": settings.FRONT_ORIGINS}})


# CSRF para formularios Flask (no afecta tus JSON API por defecto)
csrf = CSRFProtect(app)

# Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "admin_login"

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Añade las props mínimas (sin herencia)
User.is_authenticated = property(lambda self: True)
User.is_active = property(lambda self: True)
User.is_anonymous = property(lambda self: False)
User.get_id = lambda self: str(self.id)

# Rate limiting
limiter = Limiter(get_remote_address, app=app, default_limits=["200/day", "50/hour"])

# DB
db.init_app(app)
with app.app_context():
    db.create_all()

# Admin
init_admin(app, db, models=__import__('models'))

# --- API ---
@app.get("/")
def home():
    return {
        "api": "El Crisconcha API",
        "version": "1.0",
        "status": "running",
        "time": datetime.utcnow().isoformat(),
        "docs": "/admin"  # where your admin interface is
    }

@app.get("/api/health")
def health():
    return {"ok": True, "time": datetime.utcnow().isoformat()}

@app.get("/api/events")
def api_events():
    today = date.today()
    events = Event.query.filter(Event.is_published==True, Event.date>=today) \
                        .order_by(Event.date.asc()).all()
    return jsonify([{
        "id": e.id,
        "date": e.date.isoformat(),
        "location": e.location,
        "note": e.note
    } for e in events])

@csrf.exempt
@app.post("/api/leads")
@limiter.limit("5/minute")
def api_leads():
    data = request.get_json(force=True) or {}
    # Validación básica server-side
    required = ["name","email","day","month","year","location","event_type","attendees","duration"]
    missing = [k for k in required if not str(data.get(k, "")).strip()]
    if missing:
        return jsonify({"ok": False, "error": f"Faltan campos: {', '.join(missing)}"}), 400

    # email simple
    import re
    if not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", data["email"]):
        return jsonify({"ok": False, "error": "Email inválido"}), 400

    # fecha hoy o futura
    try:
        d = date(int(data["year"]), int(data["month"]), int(data["day"]))
        if d < date.today():
            return jsonify({"ok": False, "error": "Fecha debe ser hoy o futura"}), 400
    except Exception:
        return jsonify({"ok": False, "error": "Fecha inválida"}), 400

    # attendees > 0
    try:
        if int(data["attendees"]) <= 0:
            return jsonify({"ok": False, "error": "Asistentes debe ser > 0"}), 400
    except Exception:
        return jsonify({"ok": False, "error": "Asistentes inválido"}), 400

    # Guardar
    lead = Lead(
        name=data["name"].strip(),
        email=data["email"].strip(),
        day=int(data["day"]), month=int(data["month"]), year=int(data["year"]),
        location=data["location"].strip(),
        event_type=data["event_type"].strip(),
        attendees=int(data["attendees"]),
        duration=data["duration"].strip(),
        notes=(data.get("notes") or "").strip(),
        marketing_opt_in=bool(data.get("marketing_opt_in", False)),
    )
    db.session.add(lead)
    db.session.commit()

    # Enviar correo (no bloqueante sería mejor: cola/Thread)
    try:
        send_new_lead(settings, data)
    except Exception as e:
        print("[MAIL ERROR]", e)

    return jsonify({"ok": True})

# --- Admin Auth Routes ---
@app.get("/admin/login")
def admin_login():
    if current_user.is_authenticated:
        return redirect(url_for("admin.index"))
    form = AdminLoginForm()
    return render_template_string("""
    <div style="max-width:380px;margin:5rem auto;font-family:sans-serif;color:#eee;background:#111;padding:20px;border:1px solid #222">
      <h3 style="margin-top:0">Login Admin</h3>
      <form method="post" action="{{ url_for('admin_login') }}">
        {{ form.csrf_token }}   {# <— IMPORTANTE: token CSRF #}
        <label>Email</label>
        {{ form.email(class_="w-100", style="width:100%;padding:8px;margin:6px 0;background:#1a1a1a;color:#eee;border:1px solid #333") }}
        <label>Password</label>
        {{ form.password(class_="w-100", style="width:100%;padding:8px;margin:6px 0;background:#1a1a1a;color:#eee;border:1px solid #333") }}
        <button style="width:100%;padding:10px;background:#c03535;color:#fff;border:0;margin-top:8px">Entrar</button>
      </form>
    </div>
    """, form=form)

@app.post("/admin/login")
def admin_login_post():
    form = AdminLoginForm()
    if form.validate_on_submit():            # <— valida CSRF + campos
        email = form.email.data.strip().lower()
        password = form.password.data.encode()
        user = User.query.filter_by(email=email, is_admin=True).first()
        if user and bcrypt.checkpw(password, user.password_hash.encode()):
            login_user(user, remember=False)
            next_url = request.args.get("next") or url_for("admin.index")
            return redirect(next_url)
        return ("Credenciales inválidas", 401)
    # si falla CSRF o validación, vuelve a pintar el form
    return render_template_string("{{ form.csrf_token.errors }}", form=form), 400


@app.get("/admin/logout")
@login_required
def admin_logout():
    logout_user()
    return redirect("/")

    
if __name__ == "__main__":
    app.run(debug=True)  # http://localhost:5000
