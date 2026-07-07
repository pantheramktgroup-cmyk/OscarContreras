// Embed responsive de YouTube en relación 16:9.
// Acepta un videoId de YouTube y un título accesible opcional.
export default function YouTubeEmbed({ videoId, title = 'Video de YouTube' }) {
  const src = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className="yt-embed">
      <iframe
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
