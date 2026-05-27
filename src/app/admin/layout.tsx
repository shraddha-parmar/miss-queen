"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  FolderTree,
  Watch,
  ShoppingBag,
  Truck,
  Ticket,
  Users,
  Star,
  User,
  LogOut,
  Bell,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Watches", href: "/admin/products", icon: Watch },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Shipments", href: "/admin/shipments", icon: Truck },
    { name: "Coupons", href: "/admin/coupons", icon: Ticket },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Reviews", href: "/admin/reviews", icon: Star },
    { name: "Profile", href: "/admin/profile", icon: User },
  ];

  const handleLogout = () => {
    router.push("/login");
  };

  // Determine active page name for breadcrumb
  const currentTab = menuItems.find((item) => pathname === item.href)?.name || "Dashboard";

  return (
    <div className="min-h-screen bg-soft-bg flex font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-primary-dark bg-gradient-to-b from-primary-dark to-[#1E1E24] text-white flex flex-col fixed left-0 top-0 h-full border-r border-white/5 shadow-xl z-50">
        
        {/* Brand Logo Header */}
        <div className="h-16 px-6 border-b border-white/5 flex items-center justify-center shrink-0">
          <Link href="/" className="flex flex-col items-center justify-center">
            <span className="font-cinzel text-sm tracking-[0.4em] text-white">
              MISS QUEEN
            </span>
            <span className="text-[5px] tracking-[0.5em] text-gold-accent uppercase -mt-1">
              Admin Portal
            </span>
          </Link>
        </div>

        {/* Navigation Menu Links */}
        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          <span className="px-3 text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-4">
            Management
          </span>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 ${
                  isActive
                    ? "bg-gold-accent text-primary-dark shadow-md"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 mr-3 shrink-0 ${isActive ? "text-primary-dark" : "text-white/60"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-white/5 bg-black/10 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded-xl text-xs font-semibold text-white/70 hover:bg-red-500/10 hover:text-red-400 transition-colors duration-300 text-left"
          >
            <LogOut className="w-4 h-4 mr-3 text-white/60" />
            Logout Vault
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 pl-64 flex flex-col min-w-0">
        
        {/* Header Breadcrumb */}
        <header className="h-16 bg-white border-b border-border shadow-sm flex items-center justify-between px-8 sticky top-0 z-40 shrink-0">
          <div className="flex items-center text-xs font-semibold text-text-muted gap-2 uppercase tracking-widest">
            <span>Pages</span>
            <span>/</span>
            <span className="text-primary-dark font-bold">{currentTab}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Notify */}
            <button className="p-2 text-text-muted hover:text-gold-accent transition-colors relative" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold-accent rounded-full"></span>
            </button>
            
            {/* Admin Avatar */}
            <div className="flex items-center gap-2 border-l border-border pl-4">
              <div className="w-8 h-8 rounded-full bg-gold-accent/15 text-gold-accent font-bold text-xs flex items-center justify-center border border-gold-accent/20 uppercase">
                MQ
              </div>
              <span className="text-xs font-semibold text-primary-dark hidden sm:inline-block">
                Admin User
              </span>
            </div>
          </div>
        </header>

        {/* Page Inner Content */}
        <main className="p-8 flex-1 overflow-x-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
