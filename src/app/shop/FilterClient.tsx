"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown, Filter, RotateCcw, Search } from "lucide-react";

interface FilterClientProps {
  brands: string[];
  categories: any[];
  activeBrand: string;
  activeCategory: string;
  activeSort: string;
  activeMinPrice: string;
  activeMaxPrice: string;
  activeSearch: string;
}

export default function FilterClient({
  brands,
  categories,
  activeBrand,
  activeCategory,
  activeSort,
  activeMinPrice,
  activeMaxPrice,
  activeSearch,
}: FilterClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [brand, setBrand] = useState(activeBrand);
  const [category, setCategory] = useState(activeCategory);
  const [sort, setSort] = useState(activeSort);
  const [minPrice, setMinPrice] = useState(activeMinPrice);
  const [maxPrice, setMaxPrice] = useState(activeMaxPrice);
  const [search, setSearch] = useState(activeSearch);

  // Sync inputs if URL changes externally
  useEffect(() => {
    setBrand(activeBrand);
    setCategory(activeCategory);
    setSort(activeSort);
    setMinPrice(activeMinPrice);
    setMaxPrice(activeMaxPrice);
    setSearch(activeSearch);
  }, [activeBrand, activeCategory, activeSort, activeMinPrice, activeMaxPrice, activeSearch]);

  const applyFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Set updates
    Object.entries(updates).forEach(([key, val]) => {
      if (val === "" || val === "all") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    // Reset page on filter changes
    params.delete("page");

    router.push(`/shop?${params.toString()}`);
  };

  const handleReset = () => {
    setBrand("all");
    setCategory("all");
    setSort("newest");
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
    router.push("/shop");
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 self-start lg:sticky lg:top-28 z-30">
      <div className="bg-white border border-border p-6 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
          <h2 className="font-heading text-xl text-primary-dark flex items-center gap-2">
            <Filter className="w-4 h-4 text-gold-accent" />
            Filters
          </h2>
          <button
            onClick={handleReset}
            className="text-[10px] text-text-muted hover:text-gold-accent transition-colors flex items-center gap-1 font-bold uppercase tracking-wider"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>

        <div className="space-y-8">
          {/* Search Box */}
          <section>
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-muted mb-3.5">
              Search
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                applyFilters({ search });
              }}
              className="relative"
            >
              <input
                type="text"
                placeholder="Search collection..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-soft-bg border border-border/80 px-4 py-2.5 pl-10 rounded-xl text-sm focus:outline-none focus:border-gold-accent transition-colors"
              />
              <button
                type="submit"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-gold-accent transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </section>

          {/* Brand Filter */}
          <section>
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-muted mb-3.5">
              Brand
            </h3>
            <div className="relative">
              <select
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  applyFilters({ brand: e.target.value });
                }}
                className="w-full appearance-none bg-white border border-border px-4 py-2.5 pr-10 rounded-xl text-sm focus:outline-none focus:border-gold-accent transition-colors cursor-pointer text-primary-dark"
              >
                <option value="all">All Brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-text-muted absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </section>

          {/* Category Filter */}
          <section>
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-muted mb-3.5">
              Collection
            </h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setCategory("all");
                  applyFilters({ category: "all" });
                }}
                className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  category === "all"
                    ? "bg-primary-dark text-white"
                    : "bg-soft-bg text-primary-dark hover:bg-gold-accent hover:text-primary-dark"
                }`}
              >
                All Collections
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCategory(cat.slug);
                    applyFilters({ category: cat.slug });
                  }}
                  className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    category === cat.slug
                      ? "bg-primary-dark text-white"
                      : "bg-soft-bg text-primary-dark hover:bg-gold-accent hover:text-primary-dark"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </section>

          {/* Price Range Filter */}
          <section>
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-muted mb-3.5">
              Price Range
            </h3>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                onBlur={() => applyFilters({ minPrice })}
                className="w-full bg-soft-bg border border-border/80 px-4 py-2 rounded-xl text-sm focus:outline-none focus:border-gold-accent transition-colors"
              />
              <span className="text-text-muted font-light text-xs">—</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                onBlur={() => applyFilters({ maxPrice })}
                className="w-full bg-soft-bg border border-border/80 px-4 py-2 rounded-xl text-sm focus:outline-none focus:border-gold-accent transition-colors"
              />
            </div>
          </section>

          {/* Sort Filter */}
          <section>
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-muted mb-3.5">
              Sort By
            </h3>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  applyFilters({ sort: e.target.value });
                }}
                className="w-full appearance-none bg-white border border-border px-4 py-2.5 pr-10 rounded-xl text-sm focus:outline-none focus:border-gold-accent transition-colors cursor-pointer text-primary-dark"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown className="w-4 h-4 text-text-muted absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </section>
        </div>
      </div>
    </aside>
  );
}
