import Link from "next/link";
import { getWatches, getCategories } from "@/lib/watches";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import FilterClient from "./FilterClient";

interface PageProps {
  searchParams: Promise<{
    brand?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function Shop({ searchParams }: PageProps) {
  const params = await searchParams;

  const brand = params.brand || "all";
  const category = params.category || "all";
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;
  const sort = params.sort || "newest";
  const search = params.search || "";
  const page = params.page ? parseInt(params.page) : 1;
  const limit = 9; // Grid of 3x3

  // Fetch data
  const { items: watches, total, totalPages } = await getWatches({
    brand,
    category,
    minPrice,
    maxPrice,
    sort,
    search,
    page,
    limit,
  });

  const categories = await getCategories();

  // Distinct brand lists for filter selection (taken from seed)
  const brandsList = [
    "Casio",
    "Daniel Wellington",
    "Fossil",
    "Rolex",
    "Skagen",
    "Swatch",
    "Timex",
    "Tommy Hilfiger",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow pb-24">
        {/* Banner Title */}
        <div className="relative overflow-hidden text-center bg-soft-bg py-12 md:py-16 border-b border-border/50">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-gold-accent/5 blur-[100px] rounded-full -z-10"></div>
          <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
            <span className="text-gold-accent font-sans font-bold uppercase tracking-[0.4em] text-[10px] mb-2">
              Miss Queen
            </span>
            <h1 className="font-heading text-primary-dark tracking-tight text-4xl md:text-5xl mb-3">
              The Collection
            </h1>
            <div className="w-12 h-[1px] bg-gold-accent/40 mb-4"></div>
            <p className="text-text-muted text-xs md:text-sm leading-relaxed tracking-wide max-w-xl font-light">
              Discover our curated selection. {total} results.
            </p>
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="container mx-auto px-6 mt-12 flex flex-col lg:flex-row gap-12">
          {/* Client-side Interactive Filter Sidebar */}
          <FilterClient
            brands={brandsList}
            categories={categories}
            activeBrand={brand}
            activeCategory={category}
            activeSort={sort}
            activeMinPrice={params.minPrice || ""}
            activeMaxPrice={params.maxPrice || ""}
            activeSearch={search}
          />

          {/* Catalog grid */}
          <div className="flex-grow">
            {watches.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-32 border border-dashed border-border rounded-2xl bg-soft-bg/30">
                <h3 className="font-heading text-2xl text-primary-dark mb-2">No Timepieces Found</h3>
                <p className="text-text-muted text-sm max-w-xs mb-8 font-light">
                  Try clearing your filters or refining your search parameters.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {watches.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-border/60 hover:shadow-luxury transition-all duration-500 hover:-translate-y-1"
                    >
                      <div className="relative aspect-square overflow-hidden bg-soft-bg shrink-0">
                        <img
                          src={product.thumbnailUrl}
                          alt={product.name}
                          loading="lazy"
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <span className="text-[10px] uppercase tracking-widest text-text-muted mb-1.5 font-medium">
                          {product.brand}
                        </span>
                        <h3 className="font-semibold text-primary-dark line-clamp-2 text-sm group-hover:text-gold-accent transition-colors duration-300 mb-2">
                          {product.name}
                        </h3>
                        <p className="text-gold-accent font-heading font-medium text-base mt-auto">
                          ₹{product.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-16">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                      // Generate new query string
                      const qParams = new URLSearchParams();
                      if (brand !== "all") qParams.set("brand", brand);
                      if (category !== "all") qParams.set("category", category);
                      if (params.minPrice) qParams.set("minPrice", params.minPrice);
                      if (params.maxPrice) qParams.set("maxPrice", params.maxPrice);
                      if (sort !== "newest") qParams.set("sort", sort);
                      if (search) qParams.set("search", search);
                      qParams.set("page", p.toString());

                      const isCurrent = p === page;

                      return (
                        <Link
                          key={p}
                          href={`/shop?${qParams.toString()}`}
                          className={`w-10 h-10 flex items-center justify-center font-sans text-xs font-bold transition-all duration-300 border ${
                            isCurrent
                              ? "bg-primary-dark text-white border-primary-dark"
                              : "bg-white text-primary-dark border-border hover:border-gold-accent hover:text-gold-accent"
                          }`}
                        >
                          {p}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
