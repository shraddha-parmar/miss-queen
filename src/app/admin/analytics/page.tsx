import { TrendingUp, Users, ShoppingBag, ArrowUpRight } from "lucide-react";

export default function AnalyticsPage() {
  const stats = [
    { name: "Monthly Visitors", value: "1,248", icon: Users, change: "+14.2% vs last month", positive: true },
    { name: "Conversion Rate", value: "2.8%", icon: TrendingUp, change: "+0.4% vs last month", positive: true },
    { name: "Checkout Purchases", value: "35", icon: ShoppingBag, change: "-2.1% vs last month", positive: false },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading text-primary-dark tracking-wide uppercase">
          Boutique Analytics
        </h1>
        <p className="text-text-muted text-xs font-medium tracking-wider uppercase mt-1">
          Detailed metrics of visitor traffic, brand performance, and purchase conversions.
        </p>
      </div>

      {/* Analytics stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card p-6 flex items-center justify-between">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-text-muted">
                  {stat.name}
                </span>
                <p className="text-2xl font-bold text-primary-dark">{stat.value}</p>
                <span className={`text-[10px] font-semibold flex items-center gap-1 ${
                  stat.positive ? "text-green-600" : "text-red-500"
                }`}>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {stat.change}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gold-accent/5 text-gold-accent flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Brand popularity */}
        <div className="card p-6">
          <h3 className="text-xs uppercase tracking-widest text-text-muted font-bold mb-6">
            Brand Performance Share
          </h3>
          <div className="space-y-4">
            {[
              { brand: "Rolex", share: 45, color: "bg-green-600" },
              { brand: "Swatch", share: 22, color: "bg-blue-500" },
              { brand: "Daniel Wellington", share: 18, color: "bg-gold-accent" },
              { brand: "Fossil", share: 10, color: "bg-purple-500" },
              { brand: "Skagen", share: 5, color: "bg-zinc-400" },
            ].map((item) => (
              <div key={item.brand} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-primary-dark">
                  <span>{item.brand}</span>
                  <span>{item.share}%</span>
                </div>
                <div className="h-2 w-full bg-soft-bg rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.share}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="card p-6">
          <h3 className="text-xs uppercase tracking-widest text-text-muted font-bold mb-6">
            Traffic Referrals
          </h3>
          <div className="space-y-4 text-xs font-sans text-text-secondary">
            {[
              { source: "Instagram Direct Link", count: 742, percentage: "59%" },
              { source: "Direct URL loads", count: 284, percentage: "23%" },
              { source: "Google organic search", count: 184, percentage: "15%" },
              { source: "External Referral", count: 38, percentage: "3%" },
            ].map((ref, idx) => (
              <div key={idx} className="flex justify-between items-center py-2.5 border-b border-border/50 last:border-0">
                <span className="font-semibold text-primary-dark">{ref.source}</span>
                <div className="flex items-center gap-4">
                  <span>{ref.count} clicks</span>
                  <span className="font-bold text-gold-accent">{ref.percentage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
