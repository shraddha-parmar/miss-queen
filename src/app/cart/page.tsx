"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowLeft, ArrowRight, Check, Tag } from "lucide-react";
import { useCartStore, CouponState } from "@/store/useCartStore";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";

export default function CartPage() {
  const {
    items,
    coupon,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    getCartSubtotal,
    getCartTotal,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState(coupon?.code || "");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState(!!coupon);
  
  // Checkout Form States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const subtotal = getCartSubtotal();
  const total = getCartTotal();
  const discountAmount = subtotal - total;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess(false);

    const codeUpper = couponCode.trim().toUpperCase();

    // Mock validation against known seed coupons
    if (codeUpper === "LUXURY15") {
      if (subtotal < 5000) {
        setCouponError("Minimum purchase of ₹5,000 required for this coupon.");
        return;
      }
      applyCoupon({ code: "LUXURY15", discount: 15, minSpend: 5000 });
      setCouponSuccess(true);
    } else if (codeUpper === "WELCOME10") {
      applyCoupon({ code: "WELCOME10", discount: 10, minSpend: 0 });
      setCouponSuccess(true);
    } else {
      setCouponError("Invalid promo code.");
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode("");
    setCouponSuccess(false);
    setCouponError("");
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      alert("Please fill in all checkout fields.");
      return;
    }

    setIsSubmitting(true);

    // Format cart text message
    let cartItemsText = "";
    items.forEach((item, idx) => {
      cartItemsText += `${idx + 1}. *${item.name}* (SKU: ${item.sku}) - Qty: ${item.quantity} x ₹${item.price.toLocaleString("en-IN")}\n`;
    });

    const subtotalText = `₹${subtotal.toLocaleString("en-IN")}`;
    const totalText = `₹${total.toLocaleString("en-IN")}`;
    const discountText = discountAmount > 0 ? `₹${discountAmount.toLocaleString("en-IN")} (${coupon?.code})` : "None";

    const text = `*NEW WATCH ORDER - MISS QUEEN*\n\n` +
      `*Client Details*:\n` +
      `• Name: ${name}\n` +
      `• Phone: ${phone}\n` +
      `• Shipping Address: ${address}\n\n` +
      `*Items Requested*:\n${cartItemsText}\n` +
      `• Subtotal: ${subtotalText}\n` +
      `• Coupon Discount: ${discountText}\n` +
      `• *Total Payable*: ${totalText}\n\n` +
      `Please confirm the order availability and banking details. Thank you!`;

    const whatsappUrl = `https://wa.me/919560822649?text=${encodeURIComponent(text)}`;
    
    // Redirect to whatsapp
    window.open(whatsappUrl, "_blank");
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow py-12 md:py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <Link href="/shop" className="text-text-muted hover:text-gold-accent transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-heading text-3xl text-primary-dark">Shopping Cart</h1>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-24 border border-dashed border-border rounded-3xl bg-soft-bg/30">
              <ShoppingBag className="w-12 h-12 text-text-muted mb-4 stroke-[1.2]" />
              <h2 className="font-heading text-2xl text-primary-dark mb-2">Your Cart is Empty</h2>
              <p className="text-text-muted text-sm max-w-xs mb-8 font-light">
                Browse our collections to find your perfect timepiece.
              </p>
              <Link href="/shop" className="btn btn-primary px-8 py-4 rounded-xl">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Side: Cart Items List */}
              <div className="lg:col-span-7 space-y-6">
                <div className="border border-border rounded-2xl overflow-hidden shadow-sm">
                  {items.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`flex gap-4 sm:gap-6 p-6 bg-white items-center ${
                        idx > 0 ? "border-t border-border" : ""
                      }`}
                    >
                      {/* Product Thumbnail */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-soft-bg border border-border/60 shrink-0">
                        <img src={item.thumbnailUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>

                      {/* Name & Pricing details */}
                      <div className="flex-grow min-w-0">
                        <span className="text-[9px] uppercase tracking-widest text-text-muted font-bold">
                          {item.brand}
                        </span>
                        <h3 className="font-semibold text-primary-dark text-sm truncate mb-1">
                          {item.name}
                        </h3>
                        <p className="text-gold-accent font-medium text-xs">
                          ₹{item.price.toLocaleString("en-IN")}
                        </p>
                      </div>

                      {/* Quantity Adjustment */}
                      <div className="flex items-center border border-border rounded-xl px-2.5 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-primary-dark/60 hover:text-primary-dark font-medium text-sm px-1.5"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold px-2.5 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-primary-dark/60 hover:text-primary-dark font-medium text-sm px-1.5"
                        >
                          +
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-text-muted hover:text-red-500 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Promo Code module */}
                <div className="card p-6">
                  <h3 className="text-xs uppercase tracking-widest text-text-muted font-bold mb-4 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gold-accent" /> Have a Coupon?
                  </h3>
                  
                  {couponSuccess ? (
                    <div className="flex justify-between items-center bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-green-700 text-sm">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        <span>Promo Code <strong>{coupon?.code}</strong> Applied ({coupon?.discount}% Off)</span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-xs text-green-700 hover:text-red-600 font-bold uppercase tracking-wider underline underline-offset-4"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-3">
                      <input
                        type="text"
                        placeholder="ENTER COUPON CODE"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-grow bg-soft-bg border border-border/80 px-4 py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase focus:outline-none focus:border-gold-accent transition-colors"
                      />
                      <button type="submit" className="btn btn-primary px-6 rounded-xl text-[10px]">
                        Apply
                      </button>
                    </form>
                  )}
                  {couponError && <p className="text-red-600 text-xs mt-2.5 font-medium">{couponError}</p>}
                  <p className="text-text-muted text-[10px] mt-3 font-light">
                    Try using <strong className="text-gold-accent font-semibold">WELCOME10</strong> (10% off) or <strong className="text-gold-accent font-semibold">LUXURY15</strong> (15% off on ₹5,000+ orders).
                  </p>
                </div>
              </div>

              {/* Right Side: Order summary & WhatsApp Checkout Form */}
              <div className="lg:col-span-5 space-y-6">
                <div className="card">
                  <h2 className="text-xs uppercase tracking-widest text-text-muted font-bold mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 text-sm font-sans mb-6">
                    <div className="flex justify-between text-text-secondary">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>Coupon Discount ({coupon?.code})</span>
                        <span>- ₹{discountAmount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-text-secondary">
                      <span>Express Shipping</span>
                      <span className="text-green-600 font-semibold uppercase text-xs tracking-wider">Free</span>
                    </div>
                    <div className="h-px bg-border/60 w-full my-2"></div>
                    <div className="flex justify-between text-primary-dark font-bold text-base">
                      <span>Total Payable</span>
                      <span className="text-gold-accent font-heading text-lg">₹{total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h2 className="text-xs uppercase tracking-widest text-text-muted font-bold mb-6">
                    Delivery Vault Checkout
                  </h2>
                  <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Full Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-soft-bg border border-border/80 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-gold-accent"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-text-muted">WhatsApp Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full bg-soft-bg border border-border/80 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-gold-accent"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Shipping Address</label>
                      <textarea
                        required
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House Number, Street Name, City, State, ZIP Code"
                        className="w-full bg-soft-bg border border-border/80 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-gold-accent resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn btn-accent py-4 rounded-xl flex items-center justify-center gap-2 mt-4 hover:-translate-y-0.5"
                    >
                      <span>Submit Order via WhatsApp</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
