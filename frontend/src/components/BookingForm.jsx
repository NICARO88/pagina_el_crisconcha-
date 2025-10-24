import { useState, useMemo } from "react";
import { API_BASE } from "../lib/api";

/** Utilidades */
const years = (() => {
  const y = new Date().getFullYear();
  return [y, y + 1, y + 2];
})();
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const durations = ["1:00", "1:30", "2:00", "2:30"];

const initial = {
  name: "",
  email: "",
  day: "",
  month: "",
  year: "",
  location: "",
  event_type: "",
  attendees: "",
  duration: "",
  notes: "",
  marketing_opt_in: false  // nuevo campo para el checkbox  
};

export default function BookingForm() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  function update(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: null })); // limpia error de ese campo
  }

  /** Valida email simple */
  const validEmail = (s) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || "").trim());

  /** Valida fecha futura */
  const validDate = useMemo(() => {
    const { day, month, year } = form;
    if (!day || !month || !year) return null; // aún incompleta
    const d = new Date(Number(year), Number(month) - 1, Number(day));
    if (isNaN(d.getTime())) return false;
    const today = new Date();
    d.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return d >= today;
  }, [form.day, form.month, form.year]);

  function validateAll() {
    const e = {};
    if (!form.name.trim()) e.name = "Requerido";
    if (!validEmail(form.email)) e.email = "Email no válido";
    if (!form.day || !form.month || !form.year) e.date = "Completa día/mes/año";
    else if (validDate === false) e.date = "La fecha debe ser hoy o futura";
    if (!form.location.trim()) e.location = "Requerido";
    if (!form.event_type.trim()) e.event_type = "Describe el evento";
    if (!form.attendees || Number(form.attendees) <= 0)
      e.attendees = "Ingresa un número mayor a 0";
    if (!form.duration) e.duration = "Selecciona una duración";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validateAll()) return;

    setSending(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        day: Number(form.day),
        month: Number(form.month),
        year: Number(form.year),
        location: form.location,
        event_type: form.event_type,     // 👈 coincide con el backend
        attendees: Number(form.attendees),
        duration: form.duration,
        notes: form.notes || "",
        marketing_opt_in: form.marketing_opt_in
      };

      const res = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || 'Error al enviar');
      }

      setSent(true);
      setForm(initial);
    } catch (err) {
      alert(err.message || "Hubo un error inesperado. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  }


  return (
    <section id="form" className="section">
      <div className="container">
        {/* Caja oscura con borde al estilo Llama */}
        <div className="form-wrap">
          <h2 className="h2 fw-bold mb-4 text-center">COTIZA UN SHOW</h2>

          {sent && (
            <div className="alert alert-success" role="alert">
              ¡Listo! Recibí tu propuesta de evento. Te contactaré pronto.
            </div>
          )}

          <form onSubmit={onSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Nombre</label>
                <input
                  name="name"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  value={form.name}
                  onChange={update}
                  required
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  name="email"
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  value={form.email}
                  onChange={update}
                  required
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="col-12">
                <label className="form-label">Fecha</label>
                <div className="row g-2">
                  <div className="col-4">
                    <select
                      name="day"
                      className={`form-select ${errors.date ? "is-invalid" : ""}`}
                      value={form.day}
                      onChange={update}
                      required
                    >
                      <option value="">Día</option>
                      {days.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-4">
                    <select
                      name="month"
                      className={`form-select ${errors.date ? "is-invalid" : ""}`}
                      value={form.month}
                      onChange={update}
                      required
                    >
                      <option value="">Mes</option>
                      {months.map((m) => (
                        <option key={m} value={m}>
                          {String(m).padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-4">
                    <select
                      name="year"
                      className={`form-select ${errors.date ? "is-invalid" : ""}`}
                      value={form.year}
                      onChange={update}
                      required
                    >
                      <option value="">Año</option>
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.date && (
                    <div className="invalid-feedback d-block">{errors.date}</div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Ubicación</label>
                <input
                  name="location"
                  className={`form-control ${errors.location ? "is-invalid" : ""
                    }`}
                  value={form.location}
                  onChange={update}
                  required
                />
                {errors.location && (
                  <div className="invalid-feedback">{errors.location}</div>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label">Duración</label>
                <select
                  name="duration"
                  className={`form-select ${errors.duration ? "is-invalid" : ""
                    }`}
                  value={form.duration}
                  onChange={update}
                  required
                >
                  <option value="">Selecciona</option>
                  {durations.map((d) => (
                    <option key={d} value={d}>
                      {d} hr
                    </option>
                  ))}
                </select>
                {errors.duration && (
                  <div className="invalid-feedback">{errors.duration}</div>
                )}
              </div>

              <div className="col-12">
                <label className="form-label">Describe tu evento</label>
                <textarea
                  name="event_type"
                  className={`form-control ${errors.event_type ? "is-invalid" : ""
                    }`}
                  rows="3"
                  value={form.event_type}
                  onChange={update}
                  required
                />
                {errors.event_type && (
                  <div className="invalid-feedback">{errors.event_type}</div>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label">Asistentes estimados</label>
                <input
                  name="attendees"
                  type="number"
                  min="1"
                  className={`form-control ${errors.attendees ? "is-invalid" : ""
                    }`}
                  value={form.attendees}
                  onChange={update}
                  required
                />
                {errors.attendees && (
                  <div className="invalid-feedback">{errors.attendees}</div>
                )}
              </div>

              <div className="col-12">
                <label className="form-label">
                  Detalles extras (opcional)
                </label>
                <textarea
                  name="notes"
                  className="form-control"
                  rows="2"
                  value={form.notes}
                  onChange={update}
                />
              </div>

              <div className="col-12">
                <label className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="marketing_opt_in"
                    checked={form.marketing_opt_in}
                    onChange={update} />
                  <span className="form-check-label">
                    Acepto recibir novedades y promociones por email.
                  </span>
                </label>
              </div>

              <div className="col-12">
                <button
                  className="btn btn-accent w-100 py-2 fw-bold rounded-0"
                  disabled={sending}
                >
                  {sending ? "Enviando..." : "ENVIAR SOLICITUD"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
