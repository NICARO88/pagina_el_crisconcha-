import { useState, useRef, useEffect } from "react";

export default function Gallery({ items = [] }) {
  const [i, setI] = useState(0);
  const trackRef = useRef(null);

  function prev() {
    setI((n) => (n - 1 + items.length) % items.length);
  }
  function next() {
    setI((n) => (n + 1) % items.length);
  }

  useEffect(() => {
    const track = trackRef.current;
    if (track) {
      const percentage = -(i * (100 / items.length));
      track.style.transform = `translateX(${percentage}%)`;
    }
  }, [i, items.length]);

  return (
    <div className="gallery-llama">
      <div className="viewport">
        <div
          className="track"
          ref={trackRef}
          style={{ width: `${items.length * 100}%` }}
        >
          {items.map((it, idx) => (
            <div
              className="slide"
              key={idx}
            >
              <img
                src={it.src}
                alt={it.alt || `Foto ${idx + 1}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
      <button className="nav prev" onClick={prev} aria-label="Anterior">
        ‹
      </button>
      <button className="nav next" onClick={next} aria-label="Siguiente">
        ›
      </button>
      <div className="dots">
        {items.map((_, idx) => (
          <button
            key={idx}
            className={idx === i ? "dot active" : "dot"}
            onClick={() => setI(idx)}
            aria-label={`Ir a ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
