import { notFound } from "next/navigation";
import { getWatchById, getWatches } from "@/lib/watches";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import ProductClient from "./ProductClient";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const watch = await getWatchById(id);

  if (!watch) {
    notFound();
  }

  // Get related watches from the same brand or category
  const { items: relatedWatches } = await getWatches({
    category: watch.categoryId,
    limit: 4,
  });

  const filteredRelated = relatedWatches.filter((w) => w.id !== watch.id).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow pb-24">
        <div className="container mx-auto px-6 py-12 md:py-16">
          {/* Main Product Info & Gallery */}
          <ProductClient watch={watch} />

          {/* Specifications Details */}
          <section className="mt-16 border-t border-border pt-16 max-w-4xl mx-auto">
            <h2 className="text-xl font-heading text-primary-dark tracking-wide mb-8 uppercase text-center">
              Watch Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              <div className="flex justify-between py-3.5 border-b border-border/60">
                <span className="text-[11px] uppercase tracking-widest text-text-muted font-semibold">Brand</span>
                <span className="text-sm font-medium text-primary-dark">{watch.brand}</span>
              </div>
              <div className="flex justify-between py-3.5 border-b border-border/60">
                <span className="text-[11px] uppercase tracking-widest text-text-muted font-semibold">Model</span>
                <span className="text-sm font-medium text-primary-dark">{watch.model}</span>
              </div>
              <div className="flex justify-between py-3.5 border-b border-border/60">
                <span className="text-[11px] uppercase tracking-widest text-text-muted font-semibold">SKU Reference</span>
                <span className="text-sm font-mono text-primary-dark">{watch.sku}</span>
              </div>
              <div className="flex justify-between py-3.5 border-b border-border/60">
                <span className="text-[11px] uppercase tracking-widest text-text-muted font-semibold">Stock Availability</span>
                <span className={`text-sm font-bold ${watch.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                  {watch.stock > 0 ? `In Stock (${watch.stock})` : "Out of Stock"}
                </span>
              </div>
            </div>
          </section>

          {/* Related Watches */}
          {filteredRelated.length > 0 && (
            <section className="mt-24 border-t border-border pt-16">
              <h2 className="text-2xl font-heading text-primary-dark tracking-wide mb-12 text-center">
                Related Watches
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredRelated.map((product) => (
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
            </section>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
