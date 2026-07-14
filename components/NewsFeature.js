import Image from 'next/image';

// The lead story: large image, big headline, excerpt.
function NewsFeature({ url, title, text, image, source }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="group block h-full overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink/5">
        {image && (
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1024px) 640px, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink shadow-sm">
          {source}
        </span>
      </div>
      <div className="p-6">
        <h2 className="font-display text-2xl font-bold leading-tight text-ink transition-colors group-hover:text-teal">
          {title}
        </h2>
        {text && <p className="mt-3 line-clamp-3 text-ink/70">{text}</p>}
      </div>
    </a>
  );
}

export default NewsFeature;
