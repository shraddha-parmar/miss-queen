"use client";

import Link from "next/link";
import { Instagram, Twitter, Facebook, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark text-white pt-24 pb-12 mt-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-20">
          
          {/* Brand Info */}
          <div className="md:col-span-4 max-w-sm flex flex-col items-start">
            <Link href="/" className="mb-8 flex flex-col items-start">
              <span className="font-cinzel text-lg tracking-[0.4em] text-white">
                MISS QUEEN
              </span>
              <span className="text-[6px] tracking-[0.5em] text-gold-accent uppercase -mt-1">
                Horological Excellence
              </span>
            </Link>
            <p className="text-xs font-light text-white/60 mb-8 leading-relaxed tracking-wide">
              Defining horological excellence. Our mission is to curate the world's most exceptional timepieces for those who define their own legacy.
            </p>
            <div className="flex items-center gap-6 text-white/50">
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-gold-accent transition-colors duration-300">
                <Instagram className="w-4.5 h-4.5" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-gold-accent transition-colors duration-300">
                <Twitter className="w-4.5 h-4.5" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-gold-accent transition-colors duration-300">
                <Facebook className="w-4.5 h-4.5" />
              </a>
              <a href="mailto:missqueenofficial3101@gmail.com" aria-label="Email" className="hover:text-gold-accent transition-colors duration-300">
                <Mail className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Discovery Links */}
          <div className="md:col-span-2 md:col-start-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-accent mb-8">Discovery</h4>
            <ul className="space-y-4 list-none p-0 m-0">
              <li>
                <Link className="text-[11px] font-medium text-white/70 hover:text-gold-accent transition-colors tracking-widest uppercase" href="/shop">
                  All Collections
                </Link>
              </li>
              <li>
                <Link className="text-[11px] font-medium text-white/70 hover:text-gold-accent transition-colors tracking-widest uppercase" href="/shop?sort=newest">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link className="text-[11px] font-medium text-white/70 hover:text-gold-accent transition-colors tracking-widest uppercase" href="/about">
                  Our Heritage
                </Link>
              </li>
              <li>
                <Link className="text-[11px] font-medium text-white/70 hover:text-gold-accent transition-colors tracking-widest uppercase" href="/contact">
                  Find a Boutique
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Services */}
          <div className="md:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-accent mb-8">Client Services</h4>
            <ul className="space-y-4 list-none p-0 m-0">
              <li>
                <Link className="text-[11px] font-medium text-white/70 hover:text-gold-accent transition-colors tracking-widest uppercase" href="/privacy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link className="text-[11px] font-medium text-white/70 hover:text-gold-accent transition-colors tracking-widest uppercase" href="/terms">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link className="text-[11px] font-medium text-white/70 hover:text-gold-accent transition-colors tracking-widest uppercase" href="/shipping">
                  Bespoke Shipping
                </Link>
              </li>
              <li>
                <Link className="text-[11px] font-medium text-white/70 hover:text-gold-accent transition-colors tracking-widest uppercase" href="/authenticity">
                  Authenticity Guarantee
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-accent mb-8">Newsletter</h4>
            <p className="text-xs font-light text-white/55 mb-6 leading-relaxed">
              Subscribe to receive updates on new collections and exclusive events.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                aria-label="Newsletter email"
                className="bg-transparent border-b border-white/20 py-2 text-[10px] tracking-widest outline-none focus:border-gold-accent transition-colors placeholder:text-white/30"
              />
              <button
                type="submit"
                className="text-[10px] font-bold tracking-[0.3em] text-white hover:text-gold-accent transition-colors self-start uppercase"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] text-white/30 tracking-[0.2em]">
            © {currentYear} MISS QUEEN. ALL RIGHTS RESERVED.
          </p>
          <div className="text-[9px] text-gold-accent tracking-[0.4em] font-bold uppercase">
            Excellence Without Compromise
          </div>
        </div>
      </div>
    </footer>
  );
}
