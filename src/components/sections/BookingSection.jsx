import { useEffect, useRef } from 'react';
import SectionShell from '../layout/SectionShell.jsx';
import Reveal from '../ui/Reveal.jsx';
import { booking } from '../../data/content.js';

// Calendario real. Contenedor id="agenda" (destino de todos los CTA).
// El script form_embed.js se carga una sola vez.
export default function BookingSection() {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    if (document.querySelector(`script[src="${booking.embedScript}"]`)) {
      loaded.current = true;
      return;
    }
    const script = document.createElement('script');
    script.src = booking.embedScript;
    script.type = 'text/javascript';
    script.async = true;
    document.body.appendChild(script);
    loaded.current = true;
  }, []);

  return (
    <SectionShell id="agenda" tabIndex={-1} variant="white" className="booking">
      <Reveal className="booking__head" stagger>
        <h2 className="booking__title">{booking.title}</h2>
        <p className="booking__emphasis">{booking.emphasis}</p>
      </Reveal>
      <div className="booking__frame">
        <iframe
          src={booking.iframeSrc}
          id={booking.iframeId}
          title="Agenda tu evaluación estratégica gratuita"
          style={{ width: '100%', border: 'none', overflow: 'hidden' }}
          scrolling="no"
        />
      </div>
    </SectionShell>
  );
}
