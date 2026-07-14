import NewsFeature from './NewsFeature';
import NewsCard from './NewsCard';
import NewsHeadline from './NewsHeadline';

// Lays a category's articles out as an editorial page: one lead story, three
// secondary cards beside it, a grid of medium cards, then the remaining
// headlines in a compact multi-column list.
function NewsMagazine({ articles }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="py-16 text-center text-ink/50">No stories available right now.</div>
    );
  }

  const feature = articles[0];
  const sideCards = articles.slice(1, 4);
  const gridCards = articles.slice(4, 10);
  const headlines = articles.slice(10);

  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <NewsFeature {...feature} />
        </div>
        {sideCards.length > 0 && (
          <div className="flex flex-col gap-4">
            {sideCards.map((a, i) => (
              <NewsCard key={a.id || i} {...a} />
            ))}
          </div>
        )}
      </div>

      {gridCards.length > 0 && (
        <section>
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-[0.15em] text-ink/40">
            Latest
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gridCards.map((a, i) => (
              <NewsCard key={a.id || i} {...a} />
            ))}
          </div>
        </section>
      )}

      {headlines.length > 0 && (
        <section>
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-[0.15em] text-ink/40">
            More headlines
          </h2>
          <div className="gap-x-8 sm:columns-2 lg:columns-3">
            {headlines.map((a, i) => (
              <NewsHeadline key={a.id || i} {...a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default NewsMagazine;
