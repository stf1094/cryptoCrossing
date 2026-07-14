import Image from 'next/image';

// A medium story card: thumbnail, source, headline.
function NewsCard({ url, title, image, source }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink/5">
        {image && (
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-teal">{source}</span>
        <h3 className="mt-1.5 line-clamp-3 font-display text-base font-semibold leading-snug text-ink transition-colors group-hover:text-teal">
          {title}
        </h3>
      </div>
    </a>
  );
}

export default NewsCard;
