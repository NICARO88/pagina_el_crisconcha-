export default function NextEvents({ events=[] }){
  if(!events || events.length===0) return null;
  return (
    <section className="section">
      <div className="container">
        <h2 className="h2 fw-bold text-center mb-4 correct-title" id="prox-event-color">PRÓXIMOS EVENTOS</h2>
        <div className="events-llama mx-auto">
          <ul className="m-0 p-0 list-unstyled">
            {events.map((e,idx)=>(
              <li key={idx} className="item">
                <div className="d-flex flex-wrap justify-content-between">
                  <strong>{e.date}</strong>
                  <span className="text-accent">{e.place}</span>
                </div>
                {e.note && <div className="mt-1 text-muted-llama">{e.note}</div>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
