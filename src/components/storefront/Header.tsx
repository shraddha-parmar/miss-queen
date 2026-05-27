"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const [cartCount, setCartCount] = useState(0);

  // Avoid hydration mismatch
  useEffect(() => {
    setCartCount(cartItems.reduce((acc, item) => acc + item.quantity, 0));
  }, [cartItems]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ease-in-out py-4 ${
        isScrolled
          ? "bg-primary-dark/95 backdrop-blur-md shadow-lg border-b border-white/5"
          : "bg-primary-dark"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Left Side: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10 w-1/3">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <div key={link.name} className="relative group overflow-hidden">
                <Link
                  href={link.href}
                  className={`text-[11px] uppercase tracking-[0.3em] font-bold transition-colors duration-500 ${
                    isActive ? "text-gold-accent" : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
                <div
                  className={`absolute bottom-0 left-0 w-full h-[1px] bg-gold-accent transition-transform duration-500 origin-left ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></div>
              </div>
            );
          })}
        </nav>

        {/* Center: Monogram / Brand Logo */}
        <div className="flex-1 lg:flex-none text-center lg:w-1/3 flex justify-center">
          <Link href="/" className="group flex flex-col items-center justify-center transition-all duration-500">
            <span className="font-cinzel text-xl md:text-2xl tracking-[0.4em] text-white group-hover:scale-105 transition-transform duration-500">
              MISS QUEEN
            </span>
            <span className="text-[7px] tracking-[0.5em] text-gold-accent uppercase -mt-0.5">
              Horological Excellence
            </span>
          </Link>
        </div>

        {/* Right Side: Utility Icons */}
        <div className="flex items-center justify-end gap-6 w-1/3 text-white/80">
          {/* Search Icon */}
          <button className="hidden lg:block hover:text-gold-accent transition-colors duration-300">
            <Search className="w-5 h-5 stroke-[1.5]" />
          </button>

          {/* Wishlist */}
          <Link href="/wishlist" className="hidden sm:block hover:text-gold-accent transition-colors duration-300 relative">
            <Heart className="w-5 h-5 stroke-[1.5]" />
          </Link>

          {/* Cart */}
          <Link href="/cart" className="hover:text-gold-accent transition-colors duration-300 relative">
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gold-accent text-primary-dark font-sans font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Admin / Profile */}
          <Link href="/login" className="hidden lg:block hover:text-gold-accent transition-colors duration-300">
            <User className="w-5 h-5 stroke-[1.5]" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden hover:text-gold-accent transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 stroke-[1.5]" />
            ) : (
              <Menu className="w-6 h-6 stroke-[1.5]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <div
        className={`fixed inset-0 top-[68px] z-40 bg-primary-dark/98 backdrop-blur-lg lg:hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center justify-center h-[calc(100vh-120px)] gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base uppercase tracking-[0.4em] font-semibold text-white/80 hover:text-gold-accent transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px w-24 bg-white/15 my-2"></div>
          <Link
            href="/wishlist"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-sm uppercase tracking-[0.3em] text-white/60 hover:text-gold-accent transition-colors flex items-center gap-2"
          >
            <Heart className="w-4 h-4" /> Wishlist
          </Link>
          <Link
            href="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-sm uppercase tracking-[0.3em] text-white/60 hover:text-gold-accent transition-colors flex items-center gap-2"
          >
            <User className="w-4 h-4" /> Vault Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
