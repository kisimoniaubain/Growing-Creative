import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { loadNewsroomContent, newsroomCategories, newsroomPosts } from "../data/newsroomData";

const toneByCategory = {
  "market-linkages": "bg-sunrise/20 text-ink",
  "inside-the-hub": "bg-ocean/10 text-ocean dark:bg-mint/15 dark:text-mint",
  partnerships: "bg-mint/20 text-ink",
  "renewable-energy": "bg-ocean/15 text-ocean dark:bg-mint/20 dark:text-mint",
};

function Newsroom() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState(newsroomCategories);
  const [posts, setPosts] = useState(newsroomPosts);

  useEffect(() => {
    let isMounted = true;

    loadNewsroomContent().then((content) => {
      if (!isMounted) return;
      setCategories(content.categories);
      setPosts(content.posts);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredPost = posts.find((post) => post.featured) || posts[0];

  const filteredPosts = useMemo(() => {
    const loweredQuery = query.trim().toLowerCase();

    return posts.filter((post) => {
      if (post.slug === featuredPost.slug) return false;
      const categoryMatch = activeCategory === "all" || post.categoryKey === activeCategory;
      const queryMatch =
        !loweredQuery ||
        post.title.toLowerCase().includes(loweredQuery) ||
        post.excerpt.toLowerCase().includes(loweredQuery) ||
        post.category.toLowerCase().includes(loweredQuery);

      return categoryMatch && queryMatch;
    });
  }, [activeCategory, query, featuredPost?.slug, posts]);

  if (!featuredPost) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16" id="newsroom-portal">
      <div className="fade-in-up border-b border-ocean/15 pb-10">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl dark:text-slate-100">
          Newsroom & Stories from the Field
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-ink/65 dark:text-slate-300">
          Live operational updates, press releases, ecosystem announcements, and field insights direct from the
          SSE Innovation Hub.
        </p>
      </div>

      <article className="fade-in-up delay-1 mt-10 overflow-hidden rounded-3xl border border-ocean/15 bg-white shadow-soft dark:border-slate-700 dark:bg-slate-900">
        <div className="grid gap-0 lg:grid-cols-2">
          <img
            src={featuredPost.image}
            alt={featuredPost.title}
            className="h-72 w-full object-cover lg:h-full"
          />
          <div className="flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10">
            <span className="inline-flex w-max rounded-full bg-sunrise/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-ink">
              {featuredPost.category}
            </span>
            <h2 className="mt-4 font-display text-2xl font-bold text-ink dark:text-slate-100 sm:text-3xl">
              {featuredPost.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink/70 dark:text-slate-300">{featuredPost.excerpt}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-ocean/70 dark:text-mint/80">
              Published {featuredPost.published} • {featuredPost.readTime}
            </p>
            <Link
              to={`/newsroom/${featuredPost.slug}`}
              className="mt-6 inline-flex w-max items-center rounded-xl bg-ocean px-5 py-3 text-sm font-bold text-white transition hover:bg-ocean/90"
            >
              Read Full Field Story →
            </Link>
          </div>
        </div>
      </article>

      <div className="fade-in-up delay-1 mt-10 grid gap-4 border-b border-ocean/10 pb-6 lg:grid-cols-[1fr_300px] lg:items-center">
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          {categories.map((category) => (
            <button
              key={category.key}
              type="button"
              onClick={() => setActiveCategory(category.key)}
              className={`rounded-xl px-4 py-2 transition ${
                activeCategory === category.key
                  ? "bg-ocean text-white dark:bg-mint dark:text-ink"
                  : "bg-sand text-ink/75 hover:bg-ocean/10 hover:text-ocean dark:bg-slate-800 dark:text-slate-200 dark:hover:text-mint"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
        <label className="block">
          <span className="sr-only">Search newsroom posts</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            placeholder="Search updates..."
            className="w-full rounded-xl border border-ocean/20 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-ocean dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {filteredPosts.map((post, index) => (
          <article
            key={post.slug}
            className={`fade-in-up delay-${Math.min((index % 3) + 1, 3)} flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-ocean/12 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900`}
          >
            <div>
              <img src={post.image} alt={post.title} className="h-48 w-full object-cover" />
              <div className="p-6">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${toneByCategory[post.categoryKey] || "bg-sand text-ink"}`}>
                  {post.category}
                </span>
                <h3 className="mt-3 text-xl font-bold leading-snug text-ink dark:text-slate-100">
                  <Link to={`/newsroom/${post.slug}`} className="transition hover:text-ocean dark:hover:text-mint">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65 dark:text-slate-300">{post.excerpt}</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-ocean/10 p-6 pt-4 text-xs font-semibold uppercase tracking-[0.12em] text-ink/55 dark:border-slate-700 dark:text-slate-400">
              <span>{post.published}</span>
              <Link to={`/newsroom/${post.slug}`} className="text-ocean transition hover:text-mint dark:text-mint">
                Read Post →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Newsroom;
