import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, CreditCard } from "lucide-react";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import { getTrendingWatches } from "@/lib/watches";

export default async function Home() {
  const trendingWatches = await getTrendingWatches();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[90vh] min-h-[600px] flex items-center justify-start overflow-hidden bg-primary-dark text-white">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1920&auto=format&fit=crop"
              alt="Luxury Watch Collection"
              className="object-cover w-full h-full brightness-[0.4]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/40 via-transparent to-primary-dark/80 z-10"></div>
          </div>

          <div className="container mx-auto px-6 relative z-20 flex flex-col items-start text-left">
            <div className="max-w-3xl">
              <span className="inline-block text-gold-accent font-sans text-xs md:text-sm uppercase mb-6 tracking-[0.5em]">
                The Heritage Collection
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-light mb-8 leading-[0.95] tracking-tight">
                Timeless <br />
                <span className="italic font-normal text-white/95">Masterpieces</span>
              </h1>
              <p className="text-base md:text-lg text-white/70 mb-10 max-w-xl leading-relaxed font-light tracking-wide">
                Experience the pinnacle of horological engineering. Our curated collection embodies the fusion of artisanal heritage and avant-garde precision.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-start gap-4">
                <Link
                  href="/shop"
                  className="group relative px-10 py-4.5 bg-white text-primary-dark font-sans font-bold text-xs uppercase tracking-[0.2em] overflow-hidden transition-all duration-500 hover:text-white w-full sm:w-auto text-center"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    Shop Collection
                    <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" />
                  </span>
                  <div className="absolute inset-0 bg-gold-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                </Link>
                <Link
                  href="/about"
                  className="group relative px-10 py-4.5 border border-white/20 backdrop-blur-sm bg-white/5 text-white font-sans font-medium text-xs uppercase tracking-[0.2em] transition-all duration-500 hover:border-white hover:bg-white/10 w-full sm:w-auto text-center"
                >
                  Our Heritage
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
              
              {/* Shipping */}
              <div className="flex flex-col items-center text-center group">
                <div className="mb-6 text-primary-dark transition-all duration-500 group-hover:text-gold-accent group-hover:scale-110">
                  <Truck className="w-8 h-8 stroke-[1.2]" />
                </div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3 text-primary-dark">
                  Free Express Shipping
                </h3>
                <p className="text-text-secondary font-light leading-relaxed text-xs max-w-[240px]">
                  Fully insured worldwide delivery on all orders, directly to your doorstep.
                </p>
              </div>

              {/* Warranty */}
              <div className="flex flex-col items-center text-center group">
                <div className="mb-6 text-primary-dark transition-all duration-500 group-hover:text-gold-accent group-hover:scale-110">
                  <ShieldCheck className="w-8 h-8 stroke-[1.2]" />
                </div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3 text-primary-dark">
                  Authenticity Warranty
                </h3>
                <p className="text-text-secondary font-light leading-relaxed text-xs max-w-[240px]">
                  Guaranteed authenticity with an international warranty on all models.
                </p>
              </div>

              {/* Secure Payments */}
              <div className="flex flex-col items-center text-center group">
                <div className="mb-6 text-primary-dark transition-all duration-500 group-hover:text-gold-accent group-hover:scale-110">
                  <CreditCard className="w-8 h-8 stroke-[1.2]" />
                </div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3 text-primary-dark">
                  Secure Checkout
                </h3>
                <p className="text-text-secondary font-light leading-relaxed text-xs max-w-[240px]">
                  Rest easy knowing your financial transactions are protected by industry-leading encryption.
                </p>
              </div>

            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
        </section>

        {/* Trending Products */}
        <section className="py-24 bg-soft-bg overflow-hidden">
          <div className="container mx-auto px-6">
            
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <span className="h-[1px] w-12 bg-gold-accent"></span>
                  <span className="text-gold-accent text-[10px] uppercase tracking-[0.4em] font-bold">
                    Most Selling & Trending
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-heading font-light text-primary-dark leading-[1.1]">
                  Trending <span className="italic text-gold-accent">Now</span>
                </h2>
              </div>
              <Link
                href="/shop"
                className="group flex items-center gap-3 text-primary-dark font-sans font-bold text-xs uppercase tracking-[0.2em] transition-all duration-500 hover:text-gold-accent pb-2 border-b border-primary-dark/20 hover:border-gold-accent"
              >
                Shop All
                <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" />
              </Link>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {trendingWatches.map((product) => (
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

          </div>
        </section>

        {/* Access Invitation / Newsletter Banner */}
        <section className="py-24 bg-primary-dark text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-gold-accent/5 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gold-accent/5 rounded-full blur-[150px]"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <span className="text-gold-accent text-[10px] uppercase tracking-[0.5em] mb-6 block font-bold">
              The Privilege
            </span>
            <h2 className="text-4xl md:text-6xl font-heading font-light mb-6 text-white leading-tight">
              Join The <span className="italic text-gold-accent">Inner Circle</span>
            </h2>
            <p className="text-xs md:text-sm text-white/60 mb-10 max-w-xl mx-auto font-sans leading-relaxed tracking-wide">
              Be the first to experience rare arrivals, limited editions, and private vault collections. Elevate your journey with exclusive access.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button
                type="button"
                className="group relative px-12 py-4.5 bg-gold-accent text-primary-dark font-sans font-bold text-xs uppercase tracking-[0.2em] overflow-hidden transition-all duration-500 hover:text-white w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Request Access
                  <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1.5" />
                </span>
                <div className="absolute inset-0 bg-primary-dark translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
              </button>
              <Link
                href="/about"
                className="group relative px-12 py-4.5 border border-white/20 text-white font-sans font-medium text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:border-gold-accent hover:text-gold-accent w-full sm:w-auto text-center"
              >
                Explore Our Story
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
