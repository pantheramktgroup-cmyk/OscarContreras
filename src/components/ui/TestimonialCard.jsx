// Card de testimonio (data-driven). Tilt mínimo en hover vía CSS.
export default function TestimonialCard({ testimonial }) {
  const { name, role, text, image } = testimonial;
  return (
    <article className="tcard">
      <div className="tcard__stars" aria-label="Valoración: 5 de 5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="tcard__star" aria-hidden="true">
            ★
          </span>
        ))}
      </div>
      <p className="tcard__text">{text}</p>
      <div className="tcard__person">
        <img
          className="tcard__avatar"
          src={image}
          alt={`Retrato de ${name}`}
          loading="lazy"
          decoding="async"
          width="64"
          height="64"
        />
        <div className="tcard__meta">
          <span className="tcard__name">{name}</span>
          <span className="tcard__role">{role}</span>
        </div>
      </div>
    </article>
  );
}
