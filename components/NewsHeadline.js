// A compact, image-less headline for the multi-column "more headlines" list.
function NewsHeadline({ url, title, source }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="group mb-4 block break-inside-avoid border-l-2 border-transparent pl-3 transition-colors hover:border-teal"
    >
      <h4 className="line-clamp-2 font-medium leading-snug text-ink transition-colors group-hover:text-teal">
        {title}
      </h4>
      <span className="mt-1 block text-xs uppercase tracking-wide text-ink/40">{source}</span>
    </a>
  );
}

export default NewsHeadline;
