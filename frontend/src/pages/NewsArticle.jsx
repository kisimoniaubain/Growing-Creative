import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getNewsPostBySlug, loadNewsroomContent, newsroomPosts } from "../data/newsroomData";

function NewsArticle() {
  const { slug } = useParams();
  const location = useLocation();
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [posts, setPosts] = useState(newsroomPosts);

  useEffect(() => {
    let isMounted = true;

    loadNewsroomContent().then((content) => {
      if (!isMounted) return;
      setPosts(content.posts);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const post = useMemo(() => getNewsPostBySlug(slug, posts), [posts, slug]);

  if (!post) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-ocean/15 bg-white p-8 text-center shadow-soft dark:border-slate-700 dark:bg-slate-900">
          <h1 className="font-display text-3xl font-bold text-ink dark:text-slate-100">Article Not Found</h1>
          <p className="mt-3 text-sm text-ink/70 dark:text-slate-300">The newsroom article you requested is not available.</p>
          <Link to="/newsroom" className="mt-5 inline-flex rounded-xl bg-ocean px-5 py-3 text-sm font-bold text-white">
            Back to Newsroom
          </Link>
        </div>
      </section>
    );
  }

  const articleUrl = typeof window !== "undefined" ? `${window.location.origin}${location.pathname}` : location.pathname;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`;
  const whatsAppUrl = `https://wa.me/?text=${encodeURIComponent(`${post.title} ${articleUrl}`)}`;
  const currentImage = post.gallery[galleryIndex];

  const copyArticleLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_error) {
      setCopied(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div className="fade-in-up text-xs font-bold uppercase tracking-[0.14em] text-ocean/70 dark:text-mint/80">
        <Link to="/" className="transition hover:text-ocean dark:hover:text-mint">Home</Link>
        <span className="px-2">/</span>
        <Link to="/newsroom" className="transition hover:text-ocean dark:hover:text-mint">Newsroom</Link>
        <span className="px-2">/</span>
        <span>{post.category}</span>
        <span className="px-2">/</span>
        <span className="text-ink/75 dark:text-slate-300">{post.title}</span>
      </div>

      <article className="mt-6 grid gap-8 lg:grid-cols-[74px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-2">
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-ocean/10 text-ocean transition hover:bg-ocean hover:text-white dark:bg-mint/15 dark:text-mint"
              aria-label="Share on LinkedIn"
              title="Share on LinkedIn"
            >
              <i className="fa-brands fa-linkedin-in" aria-hidden="true" />
            </a>
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-ocean/10 text-ocean transition hover:bg-ocean hover:text-white dark:bg-mint/15 dark:text-mint"
              aria-label="Share on WhatsApp"
              title="Share on WhatsApp"
            >
              <i className="fa-brands fa-whatsapp" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={copyArticleLink}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-ocean/10 text-ocean transition hover:bg-ocean hover:text-white dark:bg-mint/15 dark:text-mint"
              aria-label="Copy article link"
              title="Copy article link"
            >
              <i className="fa-solid fa-link" aria-hidden="true" />
            </button>
          </div>
        </aside>

        <div className="fade-in-up rounded-3xl border border-ocean/15 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900 sm:p-8 lg:p-10">
          <span className="inline-flex rounded-full bg-sunrise/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-ink">
            {post.category}
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-ink dark:text-slate-100 sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.12em] text-ocean/70 dark:text-mint/80">
            By {post.author} | Updated {post.published}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-ink/55 dark:text-slate-400">
            {post.readTime}
          </p>

          <img src={post.image} alt={post.title} className="mt-6 h-72 w-full rounded-2xl object-cover" />

          <div className="mt-8 space-y-6 font-serif tracking-normal text-lg leading-relaxed text-ink/90 dark:text-slate-200">
            {post.body.map((paragraph, index) => (
              <div key={`${post.slug}-paragraph-${index}`}>
                <p>{paragraph}</p>
                {index === 0 && (
                  <div className="mt-8 rounded-2xl border border-ocean/15 bg-sand/70 p-4 dark:border-slate-700 dark:bg-slate-800">
                    <p className="text-sm font-bold uppercase tracking-[0.14em] text-ocean/70 dark:text-mint/80">
                      Embedded Media Gallery
                    </p>
                    <div className="mt-3 overflow-hidden rounded-2xl">
                      <img src={currentImage.src} alt={currentImage.caption} className="h-72 w-full object-cover" />
                    </div>
                    <p className="mt-3 text-sm text-ink/70 dark:text-slate-300">{currentImage.caption}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setGalleryIndex((prev) => (prev === 0 ? post.gallery.length - 1 : prev - 1))}
                        className="rounded-xl bg-ocean px-4 py-2 text-sm font-semibold text-white transition hover:bg-ocean/90"
                      >
                        Previous
                      </button>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/55 dark:text-slate-400">
                        {galleryIndex + 1} / {post.gallery.length}
                      </p>
                      <button
                        type="button"
                        onClick={() => setGalleryIndex((prev) => (prev === post.gallery.length - 1 ? 0 : prev + 1))}
                        className="rounded-xl bg-ocean px-4 py-2 text-sm font-semibold text-white transition hover:bg-ocean/90"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-ocean/10 pt-6">
            <Link to="/newsroom" className="inline-flex rounded-xl border border-ocean/25 px-5 py-3 text-sm font-bold text-ocean transition hover:bg-ocean/5 dark:border-slate-600 dark:text-mint">
              Back to Newsroom
            </Link>
          </div>
        </div>
      </article>

      <div className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-center gap-2 rounded-2xl border border-ocean/20 bg-white/95 p-2 shadow-soft backdrop-blur md:hidden dark:border-slate-700 dark:bg-slate-900/95">
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-ocean/10 px-3 py-2 text-xs font-semibold text-ocean"
        >
          <i className="fa-brands fa-linkedin-in" aria-hidden="true" />
          LinkedIn
        </a>
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-ocean/10 px-3 py-2 text-xs font-semibold text-ocean"
        >
          <i className="fa-brands fa-whatsapp" aria-hidden="true" />
          WhatsApp
        </a>
        <button
          type="button"
          onClick={copyArticleLink}
          className="inline-flex items-center gap-2 rounded-xl bg-ocean/10 px-3 py-2 text-xs font-semibold text-ocean"
        >
          <i className="fa-solid fa-link" aria-hidden="true" />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </section>
  );
}

export default NewsArticle;
