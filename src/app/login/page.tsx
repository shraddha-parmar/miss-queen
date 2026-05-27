"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Mock validation to allow direct exploration of the Admin Panel
    setTimeout(() => {
      if (email.trim() === "admin@missqueen.com" && password === "password123") {
        router.push("/admin/dashboard");
      } else if (email && password) {
        // Mock successful regular user login
        router.push("/");
      } else {
        setError("Please enter your Vault credentials.");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-soft-black text-white">
      <Header />

      <main className="flex-grow flex items-center justify-center py-16 relative overflow-hidden bg-primary-dark">
        {/* Particle / Gradient background overlays */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-accent/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gold-accent/5 rounded-full blur-[150px]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 max-w-5xl flex flex-col lg:flex-row items-center justify-around gap-12">
          
          {/* Left Column: Aesthetics Intro */}
          <div className="hidden lg:flex flex-col text-left max-w-md">
            <span className="text-gold-accent text-xs uppercase tracking-[0.5em] mb-4 block font-bold">
              The Vault Registry
            </span>
            <h1 className="text-5xl font-heading font-light text-white leading-tight mb-8">
              Precision <br />
              <span className="italic text-gold-accent mt-2 block">Redefined.</span>
            </h1>
            <div className="w-24 h-[1px] bg-gold-accent/30 mb-8"></div>
            <p className="text-white/60 text-sm font-light leading-relaxed tracking-wide">
              Secure authentication gateway. Access your private profile to track order shipments, curate your wishlist, or manage watch inventory records.
            </p>
          </div>

          {/* Right Column: Vault Login Form Card */}
          <div className="w-full max-w-md relative group">
            <div className="absolute -inset-[1px] bg-gradient-to-tr from-gold-accent/20 via-transparent to-white/10 rounded-3xl opacity-40 blur-[2px]"></div>
            
            <div className="relative bg-soft-black/95 rounded-3xl border border-white/10 p-8 sm:p-12 shadow-luxury overflow-hidden">
              <div className="text-center mb-8">
                <h2 className="text-xl font-cinzel font-light text-white tracking-[0.3em] uppercase mb-2">
                  Vault Login
                </h2>
                <div className="flex items-center justify-center gap-3">
                  <div className="h-[1px] w-6 bg-gold-accent/30"></div>
                  <p className="text-white/40 text-[9px] font-sans uppercase tracking-widest font-medium">Est. 2024</p>
                  <div className="h-[1px] w-6 bg-gold-accent/30"></div>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3 mb-6 text-center font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-gold-accent ml-1">
                    Email Credentials
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@missqueen.com"
                      className="w-full bg-white/[0.03] border border-white/10 pl-11 pr-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:border-gold-accent/60 focus:bg-white/[0.05] transition-all font-light placeholder:text-white/20"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-gold-accent ml-1">
                    Secret Key
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/[0.03] border border-white/10 pl-11 pr-11 py-3 rounded-xl text-white text-sm focus:outline-none focus:border-gold-accent/60 focus:bg-white/[0.05] transition-all font-light placeholder:text-white/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-gold-accent transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Enter Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn btn-accent py-4 rounded-xl flex items-center justify-center gap-2 mt-8 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-[10px] tracking-[0.2em]"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-primary-dark border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Enter Vault
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>

              <div className="mt-8 text-center border-t border-white/5 pt-6">
                <p className="text-gold-accent/70 text-[10px] font-medium tracking-widest uppercase">
                  Use: <strong className="text-white font-semibold">admin@missqueen.com</strong> / <strong className="text-white font-semibold">password123</strong> to explore the Admin Panel.
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
