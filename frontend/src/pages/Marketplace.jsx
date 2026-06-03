import marketBasket from "../assets/images/market-basket.jpg";
import marketFashion from "../assets/images/market-fashion.jpg";
import marketIct from "../assets/images/market-ict.jpg";
import marketAgri from "../assets/images/market-agri.jpg";
import marketEnergy from "../assets/images/market-energy.jpg";
import marketPhoto from "../assets/images/market-photo.jpg";

const products = [
  {
    id: 1,
    title: "Handcrafted Woven Basket Set",
    price: "$45",
    creator: "By Amina | Arts Track",
    image: marketBasket,
  },
  {
    id: 2,
    title: "Sustainable Streetwear Hoodie",
    price: "$60",
    creator: "By Kelvin | Fashion Track",
    image: marketFashion,
  },
  {
    id: 3,
    title: "Business Branding Starter Kit",
    price: "$120",
    creator: "By Ruth | ICT Track",
    image: marketIct,
  },
  {
    id: 4,
    title: "Organic Microgreens Supply Box",
    price: "$35",
    creator: "By David | Agriculture Track",
    image: marketAgri,
  },
  {
    id: 5,
    title: "Solar Lantern Assembly Kit",
    price: "$75",
    creator: "By Nuru | Renewable Energy Track",
    image: marketEnergy,
  },
  {
    id: 6,
    title: "Custom Event Photography Package",
    price: "$180",
    creator: "By Joel | Creative Services",
    image: marketPhoto,
  },
];

function Marketplace() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div className="fade-in-up mb-10 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean/70 dark:text-mint/80">Creative Storefront</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-ink dark:text-slate-100 sm:text-4xl">
          Discover and Purchase Youth-Made Products
        </h1>
        <p className="mt-4 text-ink/70 dark:text-slate-300">
          Every item purchased supports a founder in the Growing Creative incubation ecosystem and fuels the next cycle of local enterprise growth.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <article key={product.id} className={`fade-in-up delay-${Math.min((index % 3) + 1, 3)} overflow-hidden rounded-3xl border border-ocean/10 bg-white shadow-soft dark:border-slate-700 dark:bg-slate-900`}>
            <img src={product.image} alt={product.title} className="h-52 w-full object-cover" />
            <div className="p-5">
              <h2 className="font-display text-xl font-bold text-ink dark:text-slate-100">{product.title}</h2>
              <p className="mt-2 text-sm text-ink/60 dark:text-slate-400">{product.creator}</p>
              <div className="mt-5 flex items-center justify-between">
                <p className="text-lg font-bold text-ocean">{product.price}</p>
                <button className="rounded-lg bg-ocean px-4 py-2 text-sm font-semibold text-white transition hover:bg-ocean/90">
                  Purchase
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Marketplace;
