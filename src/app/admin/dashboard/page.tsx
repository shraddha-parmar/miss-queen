import { db } from "@/lib/db";
import { isUsingMockData } from "@/lib/watches";
import { DollarSign, Watch, ShoppingBag, Ticket, TrendingUp, Star, Users } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  // Setup stats
  let totalRevenue = 154800;
  let watchCount = 8;
  let orderCount = 14;
  let couponCount = 2;

  if (!isUsingMockData()) {
    try {
      const watches = await db.watch.count({ where: { isDeleted: false } });
      const orders = await db.order.findMany({ select: { total: true } });
      const coupons = await db.coupon.count({ where: { isActive: true } });
      
      watchCount = watches;
      orderCount = orders.length;
      totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
      couponCount = coupons;
    } catch (e) {
      console.error("Dashboard stats query failed, using mock fallbacks:", e);
    }
  }

  const kpis = [
    { name: "Total Sales Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: DollarSign, change: "+12.5% this month", color: "text-green-600 bg-green-50" },
    { name: "Active Timepieces", value: watchCount.toString(), icon: Watch, change: "All Collections", color: "text-gold-accent bg-gold-accent/5" },
    { name: "Orders Processed", value: orderCount.toString(), icon: ShoppingBag, change: "+3 pending dispatch", color: "text-blue-600 bg-blue-50" },
    { name: "Active Promo Codes", value: couponCount.toString(), icon: Ticket, change: "Coupons valid", color: "text-purple-600 bg-purple-50" },
  ];

  // Mock activity logs
  const recentOrders = [
    { id: "MQ-8492-A", customer: "Aarav Sharma", watch: "Rolex Oyster Perpetual Day-Date", total: 3200000, status: "SHIPPED", date: "24 May 2026" },
    { id: "MQ-1205-C", customer: "Priya Patel", watch: "Swatch Rebel Black Strap", total: 6850, status: "DELIVERED", date: "23 May 2026" },
    { id: "MQ-9831-D", customer: "Kabir Mehta", watch: "Skagen Melbye Titanium", total: 13995, status: "PENDING", date: "22 May 2026" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title Header */}
      <div>
        <h1 className="text-3xl font-heading text-primary-dark tracking-wide uppercase">
          Welcome back, Admin
        </h1>
        <p className="text-text-muted text-xs font-medium tracking-wider uppercase mt-1">
          Here is your boutique's operational overview.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.name} className="card p-6 flex items-center justify-between">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-text-muted">
                  {kpi.name}
                </span>
                <p className="text-2xl font-bold text-primary-dark">
                  {kpi.value}
                </p>
                <span className="text-[10px] text-text-secondary block font-medium">
                  {kpi.change}
                </span>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${kpi.color} shrink-0`}>
                <Icon className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Mock Analytics visual chart */}
        <div className="card lg:col-span-2 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs uppercase tracking-widest text-text-muted font-bold">
              Boutique Performance Graph
            </h3>
            <span className="text-[10px] text-gold-accent font-bold uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Live analytics
            </span>
          </div>

          <div className="h-64 flex items-end justify-between gap-2 px-4 border-b border-border/80 pb-2">
            {[45, 60, 52, 78, 65, 88, 92, 110, 85, 95, 125, 140].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <div
                  style={{ height: `${(val / 150) * 100}%` }}
                  className="w-full bg-gold-accent/25 hover:bg-gold-accent transition-all duration-300 rounded-t-md relative cursor-pointer"
                >
                  {/* Tooltip */}
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary-dark text-white text-[9px] font-bold py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-md">
                    ₹{val}k
                  </span>
                </div>
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-tighter">
                  {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][idx]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions panel */}
        <div className="card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-text-muted font-bold mb-6">
              Quick Admin Actions
            </h3>
            <div className="space-y-4">
              <Link
                href="/admin/products"
                className="w-full flex items-center justify-between p-4 bg-soft-bg hover:bg-gold-accent/10 border border-border/60 rounded-xl transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold-accent/15 text-gold-accent flex items-center justify-center">
                    <Watch className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-primary-dark">Manage Products</span>
                </div>
                <span className="text-gold-accent group-hover:translate-x-1 transition-transform duration-300 font-bold">→</span>
              </Link>

              <Link
                href="/admin/categories"
                className="w-full flex items-center justify-between p-4 bg-soft-bg hover:bg-gold-accent/10 border border-border/60 rounded-xl transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold-accent/15 text-gold-accent flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-primary-dark">Edit Collections</span>
                </div>
                <span className="text-gold-accent group-hover:translate-x-1 transition-transform duration-300 font-bold">→</span>
              </Link>

              <Link
                href="/admin/reviews"
                className="w-full flex items-center justify-between p-4 bg-soft-bg hover:bg-gold-accent/10 border border-border/60 rounded-xl transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold-accent/15 text-gold-accent flex items-center justify-center">
                    <Star className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-primary-dark">Moderate Reviews</span>
                </div>
                <span className="text-gold-accent group-hover:translate-x-1 transition-transform duration-300 font-bold">→</span>
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Activity Table */}
      <div className="card p-6">
        <h3 className="text-xs uppercase tracking-widest text-text-muted font-bold mb-6">
          Recent Lead Inquiries
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/80 text-text-muted font-bold uppercase tracking-wider">
                <th className="pb-3">Inquiry Reference</th>
                <th className="pb-3">Client</th>
                <th className="pb-3">Watch Model Requested</th>
                <th className="pb-3 text-right">Estimated Total</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 text-right">Inquiry Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-border/60 last:border-0 hover:bg-soft-bg/30 transition-colors">
                  <td className="py-4 font-mono font-bold text-primary-dark">{order.id}</td>
                  <td className="py-4 font-medium">{order.customer}</td>
                  <td className="py-4 text-text-secondary">{order.watch}</td>
                  <td className="py-4 text-right font-bold text-primary-dark">₹{order.total.toLocaleString("en-IN")}</td>
                  <td className="py-4 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      order.status === "DELIVERED"
                        ? "bg-green-100 text-green-700"
                        : order.status === "SHIPPED"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 text-right text-text-muted">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
