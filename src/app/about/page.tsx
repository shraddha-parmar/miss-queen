import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import { Shield, Clock, MapPin, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow">
        {/* Banner Section */}
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center bg-primary-dark text-white text-center">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1920&auto=format&fit=crop"
              alt="Bespoke Watch craftsmanship"
              className="object-cover w-full h-full brightness-[0.3]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/30 to-primary-dark/80 z-10"></div>
          </div>
          <div className="container mx-auto px-6 relative z-20 max-w-3xl">
            <span className="text-gold-accent font-sans text-xs md:text-sm uppercase tracking-[0.5em] mb-4 block">
              Est. 2024
            </span>
            <h1 className="text-4xl md:text-6xl font-heading font-light tracking-tight mb-4">
              Our <span className="italic text-gold-accent">Heritage</span>
            </h1>
            <div className="w-16 h-[1px] bg-gold-accent/40 mx-auto"></div>
          </div>
        </section>

        {/* Narrative Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-heading text-primary-dark tracking-wide mb-6 uppercase">
                Excellence Without Compromise
              </h2>
              <p className="text-text-secondary leading-relaxed font-light text-base md:text-lg max-w-2xl mx-auto">
                Founded on the principles of Swiss precision and classic sophistication, Miss Queen curates the world's most sought-after horological masterworks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm leading-relaxed text-text-secondary font-light">
              <div className="space-y-4">
                <p>
                  Every timepiece tells a story of patience, discipline, and uncompromising detail. At Miss Queen, we understand that a luxury watch is not merely a tool for marking time, but a profound expression of your personal legacy.
                </p>
                <p>
                  Our curatorial team travels globally to authenticate and secure rare, vintage, and modern marvels from historic manufactures. From daily luxury accessories to rare investment-grade models, each watch satisfies strict standards of condition and mechanical integrity.
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  We are proud to provide clients with a tailored boutique experience that respects the historical weight of watchmaking heritage. With fully insured express shipping and personal horology consultations, we serve collectors around the world.
                </p>
                <p>
                  As we look to the future of timekeeping, Miss Queen remains steadfastly anchored to the values of craftsmanship, authenticity, and design perfection. Join our inner circle to write your own chapter in time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="py-20 bg-soft-bg relative">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="card text-center p-8 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gold-accent/10 flex items-center justify-center text-gold-accent mb-6">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-medium text-primary-dark mb-3 uppercase tracking-wider">
                  Curated Rarity
                </h3>
                <p className="text-text-muted text-xs leading-relaxed font-light">
                  We hand-select each timepiece, focusing on historical provenance, design rarity, and premium materials.
                </p>
              </div>

              <div className="card text-center p-8 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gold-accent/10 flex items-center justify-center text-gold-accent mb-6">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-medium text-primary-dark mb-3 uppercase tracking-wider">
                  Bespoke Authenticity
                </h3>
                <p className="text-text-muted text-xs leading-relaxed font-light">
                  Our certified watch specialists inspect every movement, gear, and casing to guarantee 100% authenticity.
                </p>
              </div>

              <div className="card text-center p-8 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gold-accent/10 flex items-center justify-center text-gold-accent mb-6">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-medium text-primary-dark mb-3 uppercase tracking-wider">
                  Timeless Service
                </h3>
                <p className="text-text-muted text-xs leading-relaxed font-light">
                  We maintain long-term support for our collectors, offering custom sourcing, repair tracking, and warranty help.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Boutique Finder */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="text-3xl font-heading text-primary-dark tracking-wide mb-6 uppercase">
              Bespoke Showroom
            </h2>
            <div className="w-12 h-[1px] bg-gold-accent/40 mx-auto mb-8"></div>
            <p className="text-text-secondary leading-relaxed font-light text-sm max-w-xl mx-auto mb-12">
              For private viewings and dedicated horology consultations, schedule an appointment to visit our secure gallery.
            </p>
            <div className="inline-flex items-center gap-2 text-gold-accent border-b border-gold-accent/40 pb-2 hover:border-gold-accent transition-colors cursor-pointer text-sm font-semibold tracking-widest uppercase">
              <MapPin className="w-4 h-4" /> Mumbai Showroom & Private Office
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
