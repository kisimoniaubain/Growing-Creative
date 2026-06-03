import homeMarketHero from "../assets/images/home-market-hero.jpg";
import storyTailer from "../assets/images/story-tailer.png";
import hubFashionMarket from "../assets/images/hub-fashion-market.jpg";
import hubIctMarket from "../assets/images/hub-ict-market.jpg";
import hubArtsMarket from "../assets/images/hub-arts-market.jpg";
import hubEnergyMarket from "../assets/images/hub-energy-market.jpg";
import storyElectricity from "../assets/images/story-electricity.png";
import hubAgriMarket from "../assets/images/hub-agri-market.jpg";
import storyMarchand from "../assets/images/story-marchand.png";
import storyAmani from "../assets/images/story-amani.png";

const imageByKey = {
  homeMarketHero,
  storyTailer,
  hubFashionMarket,
  hubIctMarket,
  hubArtsMarket,
  hubEnergyMarket,
  storyElectricity,
  hubAgriMarket,
  storyMarchand,
  storyAmani,
};

export const newsroomCategories = [
  { key: "all", label: "All Updates" },
  { key: "market-linkages", label: "Market Linkages" },
  { key: "inside-the-hub", label: "Inside the Hub" },
  { key: "partnerships", label: "Partnerships" },
  { key: "renewable-energy", label: "Renewable Energy" },
];

export const newsroomPosts = [
  {
    slug: "trade-fair-series-2026",
    category: "MARKET LINKAGES",
    categoryKey: "market-linkages",
    title:
      "Growing Creative Launches 2026 Creative Trade Fair Series to Connect Local Graduates with B2B Corporate Contracts.",
    excerpt:
      "Our Phase 4 pipeline has officially moved into the commercial sector. This month, 45 graduates from Fashion and Arts debuted storefronts to regional buyers and secured immediate bulk supply contracts.",
    published: "May 24, 2026",
    readTime: "4 min read",
    author: "Project Communications Lead",
    image: homeMarketHero,
    gallery: [
      { src: homeMarketHero, caption: "Opening day for the Creative Trade Fair series in Mombasa." },
      { src: hubFashionMarket, caption: "Fashion graduates presenting bulk-ready product lines." },
      { src: hubArtsMarket, caption: "Arts track teams displaying catalog-ready pieces for buyers." },
    ],
    body: [
      "Phase 4 market expansion moved from planning into execution in May 2026, with the first Creative Trade Fair now operating as a live buyer-seller bridge. This model is designed to reduce the time between graduation and first revenue for youth-owned enterprises.",
      "During the first fair window, 45 graduates showcased products in curated clusters for fashion, creative arts, and digital branding services. Corporate procurement teams and independent retail chains used on-site catalog reviews to initiate pilot and bulk order discussions.",
      "In addition to direct contracts, the fair introduced a structured mentorship station where buyers provided quality feedback, packaging guidance, and delivery standards. These corrections now feed into weekly coaching cycles at the hub.",
      "The next three trade fair editions will run across 2026 with stronger county-level business participation, expanded logistics support, and post-contract tracking to ensure fulfillment quality and repeat orders.",
    ],
    featured: true,
  },
  {
    slug: "cohort-2-graduation-2026",
    category: "INSIDE THE HUB",
    categoryKey: "inside-the-hub",
    title: "Empowering the Next 120: Highlights from the Cohort 2 Graduation Ceremony.",
    excerpt:
      "Photo galleries and performance metrics from our latest group of secondary school graduates transitioning into independent business operators.",
    published: "May 12, 2026",
    readTime: "5 min read",
    author: "Hub Program Office",
    image: storyTailer,
    gallery: [
      { src: storyTailer, caption: "Cohort 2 graduates during final portfolio showcase." },
      { src: hubIctMarket, caption: "ICT teams presenting online storefront prototypes." },
      { src: hubFashionMarket, caption: "Tailoring graduates receiving production starter kits." },
    ],
    body: [
      "Cohort 2 concluded with 120 youth completing technical and business-readiness tracks across fashion, ICT, arts, agriculture, and renewable energy. Graduation assessments included practical production demos, business model review, and market readiness scoring.",
      "Families, local administrators, and partner organizations attended the ceremony where each track presented outcomes and growth plans. Several teams used the event to secure first customer commitments and community distribution contacts.",
      "The post-graduation period now includes weekly enterprise check-ins, marketplace onboarding, and revolving fund coaching to help graduates maintain cashflow discipline while scaling sales.",
    ],
  },
  {
    slug: "regional-allies-revolving-fund-portfolio",
    category: "PARTNERSHIPS",
    categoryKey: "partnerships",
    title:
      "Growing Creative Welcomes New Regional Corporate Allies to the $30,000 Revolving Fund Portfolio.",
    excerpt:
      "Documenting new financial agreements aimed at scaling micro-loan access to $1,000 caps for advanced technical tracks.",
    published: "May 6, 2026",
    readTime: "3 min read",
    author: "Finance & Partnerships Unit",
    image: hubAgriMarket,
    gallery: [
      { src: hubAgriMarket, caption: "Partnership roundtable on fund co-financing strategy." },
      { src: hubArtsMarket, caption: "Small-enterprise products prepared for investor review." },
      { src: hubIctMarket, caption: "Digital dashboard used for revolving fund tracking." },
    ],
    body: [
      "New regional allies joined the revolving fund portfolio to expand available loan windows for graduates entering high-demand production cycles. This partnership structure prioritizes accountable lending and clear repayment milestones tied to business performance.",
      "Funding partners approved a coordinated framework that aligns disbursement with mentorship milestones. This helps youth founders scale responsibly while maintaining transparent financial reporting.",
      "By the next quarter, the partnership desk will publish a monthly scorecard covering disbursement, repayment velocity, and portfolio health by track.",
    ],
  },
  {
    slug: "solar-array-community-market-installation",
    category: "RENEWABLE ENERGY",
    categoryKey: "renewable-energy",
    title:
      "Green Infrastructure Grid: Youth Teams Install Solar Power Array for Local Community Market.",
    excerpt:
      "Renewable Energy track participants applied classroom workshops directly to a live community venture, powering local commerce.",
    published: "Apr 28, 2026",
    readTime: "4 min read",
    author: "Renewable Energy Track Lead",
    image: hubEnergyMarket,
    gallery: [
      { src: hubEnergyMarket, caption: "Youth technical team installing panel supports at site." },
      { src: storyElectricity, caption: "Electrical testing and safety validation in field conditions." },
      { src: hubIctMarket, caption: "Monitoring dashboards used to track output and uptime." },
    ],
    body: [
      "Youth clean-tech teams delivered their first decentralized solar array installation to support a local community market zone. The installation is designed to stabilize vendor power access and reduce reliance on expensive diesel generation.",
      "The project doubled as a field classroom where participants practiced load calculations, safety checks, and performance monitoring under mentor supervision.",
      "Operational data from the site will be integrated into upcoming training modules so future cohorts can replicate and improve the model across more markets.",
    ],
  },
];

const normalizePostFromJson = (post) => {
  const fallbackImage = homeMarketHero;
  const mappedImage = imageByKey[post.imageKey] || fallbackImage;
  const mappedGallery = Array.isArray(post.gallery)
    ? post.gallery
        .map((item) => {
          const src = imageByKey[item.imageKey];
          if (!src) return null;
          return {
            src,
            caption: item.caption || "",
          };
        })
        .filter(Boolean)
    : [];

  return {
    ...post,
    image: mappedImage,
    gallery: mappedGallery.length
      ? mappedGallery
      : [{ src: mappedImage, caption: "Field documentation image" }],
  };
};

export const loadNewsroomContent = async () => {
  try {
    const response = await fetch("/data/newsroom.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Newsroom JSON not found");

    const payload = await response.json();
    const categories = Array.isArray(payload.categories) && payload.categories.length
      ? payload.categories
      : newsroomCategories;

    const posts = Array.isArray(payload.posts)
      ? payload.posts
          .filter((post) => post && post.slug)
          .map((post) => normalizePostFromJson(post))
      : [];

    if (!posts.length) {
      return { categories: newsroomCategories, posts: newsroomPosts };
    }

    return { categories, posts };
  } catch (_error) {
    return { categories: newsroomCategories, posts: newsroomPosts };
  }
};

export const getNewsPostBySlug = (slug, posts = newsroomPosts) => posts.find((post) => post.slug === slug);

