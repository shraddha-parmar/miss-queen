"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";

export default function WishlistPage() {
  const wishlistItems = useWishlistStore((state) => state.items);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const addToCart = useCartStore((state) => state.addToCart);

  // Avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gold-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleMoveToCart = (item: any) => {
    addToCart({
      id: item.id,
      sku: item.sku,
      name: item.name,
      brand: item.brand,
      price: item.price,
      thumbnailUrl: item.thumbnailUrl,
    }, 1);
    removeFromWishlist(item.id);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow py-12 md:py-16">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <Link href="/shop" className="text-text-muted hover:text-gold-accent transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-heading text-3xl text-primary-dark">My Wishlist</h1>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-24 border border-dashed border-border rounded-3xl bg-soft-bg/30">
              <Heart className="w-12 h-12 text-text-muted mb-4 stroke-[1.2]" />
              <h2 className="font-heading text-2xl text-primary-dark mb-2">Wishlist is Empty</h2>
              <p className="text-text-muted text-sm max-w-xs mb-8 font-light">
                Mark timepieces with a heart to save them in your vault database.
              </p>
              <Link href="/shop" className="btn btn-primary px-8 py-4 rounded-xl">
                Explore Catalog
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-border/60 hover:shadow-luxury transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="relative aspect-square overflow-hidden bg-soft-bg shrink-0">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.name}
                      loading="lazy"
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                    />
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-full text-text-muted hover:text-red-500 transition-colors shadow-sm"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="text-[10px] uppercase tracking-widest text-text-muted mb-1.5 font-medium">
                      {item.brand}
                    </span>
                    <Link href={`/product/${item.id}`}>
                      <h3 className="font-semibold text-primary-dark line-clamp-2 text-sm hover:text-gold-accent transition-colors duration-300 mb-2">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-gold-accent font-heading font-medium text-base mb-4">
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>

                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="btn btn-primary w-full py-3.5 rounded-xl flex items-center justify-center gap-2 mt-auto text-[10px] tracking-[0.15em]"
                    >
                      <ShoppingBag className="w-4 h-4" /> Move to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
