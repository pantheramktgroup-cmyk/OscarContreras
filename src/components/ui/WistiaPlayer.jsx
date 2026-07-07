import { useEffect, useRef } from 'react';

// Integra el player Wistia como custom element dentro de React.
// Carga los scripts una sola vez y crea el elemento imperativamente.
export default function WistiaPlayer({ mediaId }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Carga player.js global una sola vez.
    const PLAYER_ATTR = 'data-wistia-player-loaded';
    if (!document.querySelector(`script[${PLAYER_ATTR}]`)) {
      const s = document.createElement('script');
      s.src = 'https://fast.wistia.com/player.js';
      s.async = true;
      s.setAttribute(PLAYER_ATTR, '');
      document.head.appendChild(s);
    }

    // Carga el script del embed específico una sola vez.
    const embedAttr = `data-wistia-embed-${mediaId}`;
    if (!document.querySelector(`script[${embedAttr}]`)) {
      const s2 = document.createElement('script');
      s2.src = `https://fast.wistia.com/embed/${mediaId}.js`;
      s2.async = true;
      s2.type = 'module';
      s2.setAttribute(embedAttr, '');
      document.head.appendChild(s2);
    }

    // Inserta el custom element en el contenedor DOM.
    const container = containerRef.current;
    if (container && !container.querySelector('wistia-player')) {
      const wp = document.createElement('wistia-player');
      wp.setAttribute('media-id', mediaId);
      wp.setAttribute('aspect', '1.7777777777777777');
      container.appendChild(wp);
    }
  }, [mediaId]);

  return (
    <div className="wistia-wrap">
      <style>{`
        wistia-player[media-id='${mediaId}']:not(:defined) {
          background: center / contain no-repeat
            url('https://fast.wistia.com/embed/medias/${mediaId}/swatch');
          display: block;
          filter: blur(5px);
          padding-top: 56.25%;
        }
      `}</style>
      <div ref={containerRef} className="wistia-player-container" />
    </div>
  );
}
