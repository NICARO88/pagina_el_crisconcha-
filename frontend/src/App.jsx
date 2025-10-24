import { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import BookingForm from "./components/BookingForm.jsx";
import Gallery from "./components/Gallery.jsx";
import NextEvents from "./components/NextEvents.jsx";


export default function App() {
  const [events, setEvents] = useState([]);
  const [evLoading, setEvLoading] = useState(true);

  // Add useEffect to fetch events when component mounts
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error cargando eventos", e);
      } finally {
        setEvLoading(false);
      }
    })();
  }, []);
  // const events = [{ date:"15 Dic 2025", place:"Teatro X, Santiago", note:"Show íntimo acústico" }];

  const gallery = [
    { src: "/img/gallery-1.png", alt: "CRISCONCHA en vivo" },
    { src: "/img/gallery-2.png", alt: "Guitarra acústica en escena" },
    { src: "/img/gallery-3.png", alt: "Ambiente grunge íntimo" },
  ];

  return (
  
    <div className="page">
      
    <Navbar />
      {/* HERO estilo Llama: fondo imagen + overlay + CTA */}
      <header className="hero-llama position-relative">
        <div className="hero-bg"></div>
        <div className="container position-relative">
          <div className="row align-items-center">
            <div className="col-12 col-md-6 py-5">
              <h1 className="display-5 fw-bold mb-3 text-white">
                GRUNGE ACÚSTICO · NOSTALGIA Y <span className="text-accent">ENERGÍA</span>
              </h1>
              <p className="lead text-muted-llama mb-4" style={{ maxWidth: 600 }}>
                Covers y canciones propias en clave noventera: guitarra, voz y crudeza acústica
                que transforman el ambiente. Un show íntimo, con intensidad y cercanía,
                perfecto para bares, privados o cualquier escenario que busque una experiencia real.
              </p>
              <a className="btn btn-accent btn-lg rounded-0" href="#form">COTIZAR SHOW</a>
            </div>
            <div className="col-12 col-md-6 py-5 d-flex justify-content-center">
              {/* marco “poster” estilo Llama */}
              <div className="poster-wrap">
                <div className="poster-layer layer-a"></div>
                <div className="poster-layer layer-b"></div>
                <div className="poster-core d-flex align-items-center justify-content-center">
                  {/* tu logo en el centro (webp) */}
                  <img className="hero-logo"
                    src="/img/el-crisconcha-logo.webp"
                    alt="EL CRISCONCHA — logo oficial rojo y negro"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* QUIÉN SOY con foto + overlay oscuro */}
      <section className="section who">
        <div className="who-bg"></div>
        <div className="container position-relative">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="who-card">
                <h2 className="h2 fw-bold mb-3">SOBRE CRIS CONCHA</h2>
                <p className="mb-4">
                  Soy <strong>CRIS CONCHA</strong>: músico chileno, con calle y presencia en TV.
                  Traigo la esencia del grunge de los 90 en formato acústico, combinando clásicos
                  y temas originales con una vibra oscura y directa. Un show donde la nostalgia
                  se mezcla con la energía de estar aquí y ahora.
                </p>
                <a className="btn btn-accent rounded-0" href="#form">COTIZAR AHORA</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRÓXIMOS EVENTOS (solo si hay) */}
      {!evLoading && <NextEvents events={events} />}


      {/* GALERÍA (carrusel simple sin librerías) */}
      <section className="section">
        <div className="container">
          <h2 className="h2 fw-bold text-center mb-4 correct-title">GALERÍA</h2>
          <Gallery items={gallery} />
        </div>
      </section>

      {/* FORMULARIO (tu componente) */}
      <BookingForm />

      {/* FOOTER minimal */}
      <footer className="footer-llama">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div>
            <div className="fw-bold">CRIS CONCHA</div>
            <small className="text-muted-llama">Nostalgia y energía</small>
          </div>
          <small className="text-muted-llama">
            © {new Date().getFullYear()} CRIS CONCHA. Todos los derechos reservados.
          </small>
          <p className="dev-credit">Site by
            <a href="https://github.com/NICARO88" target="_blank" rel="noopener noreferrer"> NICARO88</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

