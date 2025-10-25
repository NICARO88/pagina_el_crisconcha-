# mailer.py
import smtplib, ssl
from email.message import EmailMessage

def send_new_lead(settings, lead_data: dict):
    if not settings.SMTP_HOST:
        print("[WARN] SMTP no configurado, no se envía correo.")
        return

    msg = EmailMessage()
    msg["Subject"] = "Nueva solicitud de show — EL CRISCONCHA"
    msg["From"] = settings.SMTP_USER or settings.MAIL_TO
    msg["To"] = settings.MAIL_TO
    msg["Reply-To"] = lead_data.get("email","")

    resumen = f"""
Nueva solicitud de show:

Nombre: {lead_data.get('name')}
Email: {lead_data.get('email')}
Fecha: {lead_data.get('day')}/{lead_data.get('month')}/{lead_data.get('year')}
Ubicación: {lead_data.get('location')}
Duración: {lead_data.get('duration')}
Asistentes: {lead_data.get('attendees')}
Evento: {lead_data.get('event_type')}
Notas: {lead_data.get('notes')}
Acepta promos: {lead_data.get('marketing_opt_in')}
"""
    msg.set_content(resumen)

    context = ssl.create_default_context()

    # 👇 el timeout evita que se cuelgue el worker si no hay conexión
    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=20) as server:
        server.ehlo()
        server.starttls(context=context)
        server.ehlo()
        if settings.SMTP_USER:
            server.login(settings.SMTP_USER, settings.SMTP_PASS)
        server.send_message(msg)

    print("[MAIL OK] Enviado a", settings.MAIL_TO)
