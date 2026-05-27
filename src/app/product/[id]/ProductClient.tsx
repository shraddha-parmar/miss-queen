"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { Heart, MessageSquare, Star, ShoppingBag, Check } from "lucide-react";

interface ProductClientProps {
  watch: any;
}

export default function ProductClient({ watch }: ProductClientProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [added, setAdded] = useState(false);
  
  // Gallery images setup
  const gallery = watch.images && watch.images.length > 0 
    ? watch.images.map((img: any) => img.imageUrl) 
    : [watch.thumbnailUrl];

  const [activeImage, setActiveImage] = useState(gallery[0]);

  const handleAddToCart = () => {
    addToCart({
      id: watch.id,
      sku: watch.sku,
      name: watch.name,
      brand: watch.brand,
      price: watch.price,
      thumbnailUrl: watch.thumbnailUrl,
    }, 1);

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsAppContact = () => {
    const message = `Hi Miss Queen, I am interested in purchasing the following watch:\n\n*Name*: ${watch.name}\n*Brand*: ${watch.brand}\n*Price*: ₹${watch.price.toLocaleString("en-IN")}\n*SKU Reference*: ${watch.sku}\n\nIs it available?`;
    // Encodes the message to WhatsApp link format
    const whatsappUrl = `https://wa.me/919560822649?text=${encodeURIComponent(message)}`; // standard mock number or custom config
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
      {/* Left Column: Image Gallery */}
      <div className="space-y-4">
        <div className="aspect-square rounded-2xl overflow-hidden bg-soft-bg border border-border/80">
          <img
            src={activeImage}
            alt={watch.name}
            className="w-full h-full object-cover transition-all duration-300"
          />
        </div>
        {gallery.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {gallery.map((imgUrl: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveImage(imgUrl)}
                className={`aspect-square rounded-xl overflow-hidden bg-soft-bg border transition-all duration-300 ${
                  activeImage === imgUrl ? "border-gold-accent ring-2 ring-gold-accent/20" : "border-border/60"
                }`}
              >
                <img src={imgUrl} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Information Section */}
      <div className="flex flex-col h-full justify-center">
        <div className="mb-6">
          <span className="text-gold-accent text-xs md:text-sm uppercase tracking-[0.25em] mb-2.5 block font-bold">
            {watch.brand}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-light mb-4 text-primary-dark leading-tight">
            {watch.name}
          </h1>
          <p className="text-2xl md:text-3xl font-heading font-medium text-gold-accent mb-6">
            ₹{watch.price.toLocaleString("en-IN")}
          </p>

          <div className="flex items-center gap-3">
            <div className="flex items-center text-gold-accent gap-0.5" aria-label="5 stars rating">
              <Star className="w-4 h-4 fill-current stroke-none" />
              <Star className="w-4 h-4 fill-current stroke-none" />
              <Star className="w-4 h-4 fill-current stroke-none" />
              <Star className="w-4 h-4 fill-current stroke-none" />
              <Star className="w-4 h-4 fill-current stroke-none" />
            </div>
            <span className="text-[11px] text-text-muted font-sans uppercase tracking-widest font-semibold mt-0.5">
              (5.0 out of 5) Verified Ratings
            </span>
          </div>
        </div>

        <div className="h-px bg-border/60 w-full mb-8"></div>

        {/* Product Description */}
        <section className="rounded-2xl border border-border/80 p-6 bg-soft-bg/40 mb-8">
          <h2 className="text-[10px] uppercase tracking-widest text-text-muted font-bold mb-3.5">
            Product Description
          </h2>
          <p className="text-text-secondary leading-relaxed text-sm md:text-base font-light">
            {watch.description}
          </p>
        </section>

        {/* Action Buttons */}
        <div className="space-y-4 mt-auto">
          <button
            onClick={handleAddToCart}
            disabled={watch.stock <= 0}
            className={`w-full btn min-h-[3.75rem] py-4 rounded-2xl ${
              added 
                ? "bg-green-600 border-green-600 text-white" 
                : "btn-accent shadow-luxury hover:-translate-y-0.5"
            }`}
          >
            {added ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-4.5 h-4.5" /> Added to Cart
              </span>
            ) : watch.stock > 0 ? (
              <span className="flex items-center justify-center gap-2">
                <ShoppingBag className="w-4.5 h-4.5" /> Add to Cart
              </span>
            ) : (
              "Out of Stock"
            )}
          </button>
          
          <button
            onClick={handleWhatsAppContact}
            className="w-full btn btn-primary min-h-[3.75rem] py-4 rounded-2xl flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            <MessageSquare className="w-4.5 h-4.5" /> Contact on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
