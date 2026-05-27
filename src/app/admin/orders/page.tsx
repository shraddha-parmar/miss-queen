"use client";

import { useState } from "react";
import { ShoppingBag, Search, ExternalLink, Calendar, Phone, MapPin, Tag } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  phone: string;
  address: string;
  watches: string;
  total: number;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "CANCELLED";
  date: string;
  couponApplied?: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([
    {
      id: "MQ-ORDER-8492",
      name: "Aarav Sharma",
      phone: "+91 98765 43210",
      address: "House 45, Sector 4, Rohini, New Delhi, 110085",
      watches: "1x Rolex Oyster Perpetual Day-Date Gold",
      total: 3200000,
      status: "SHIPPED",
      date: "24 May 2026",
    },
    {
      id: "MQ-ORDER-1205",
      name: "Priya Patel",
      phone: "+91 91234 56789",
      address: "Apt 201, Elite Enclave, Juhu, Mumbai, 400049",
      watches: "1x Swatch Rebel Black Silicone, 1x Timex Easy Reader Date",
      total: 10145,
      status: "CONFIRMED",
      date: "23 May 2026",
      couponApplied: "WELCOME10",
    },
    {
      id: "MQ-ORDER-9831",
      name: "Kabir Mehta",
      phone: "+91 99999 88888",
      address: "Flat 12B, Silver Sands, Koramangala, Bangalore, 560034",
      watches: "1x Skagen Melbye Titanium Mesh Watch",
      total: 13995,
      status: "PENDING",
      date: "22 May 2026",
    },
  ]);

  const [search, setSearch] = useState("");

  const handleUpdateStatus = (id: string, newStatus: OrderItem["status"]) => {
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.watches.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      
      {/* Header Title */}
      <div>
        <h1 className="text-3xl font-heading text-primary-dark tracking-wide uppercase">
          Client Orders & Leads
        </h1>
        <p className="text-text-muted text-xs font-medium tracking-wider uppercase mt-1">
          Review WhatsApp checkout inquiries, manage dispatch statuses, and track sales receipts.
        </p>
      </div>

      {/* Filters Search */}
      <div className="relative w-full sm:w-80">
        <input
          type="text"
          placeholder="Search inquiries by client, order ID, watch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-border pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-gold-accent transition-colors"
        />
        <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* Orders Grid List */}
      <div className="space-y-6">
        {filteredOrders.map((o) => (
          <div key={o.id} className="card p-6 border border-border/80">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/60 pb-4 mb-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono font-bold text-sm text-primary-dark">{o.id}</span>
                <span className="text-[10px] text-text-muted font-sans font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {o.date}
                </span>
                {o.couponApplied && (
                  <span className="inline-flex items-center gap-1 bg-gold-accent/10 text-gold-accent border border-gold-accent/25 px-2 py-0.5 rounded text-[9px] font-bold">
                    <Tag className="w-3 h-3" /> {o.couponApplied}
                  </span>
                )}
              </div>

              {/* Status Select Actions */}
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  o.status === "SHIPPED"
                    ? "bg-blue-50 text-blue-700 border border-blue-100"
                    : o.status === "CONFIRMED"
                    ? "bg-green-50 text-green-700 border border-green-100"
                    : o.status === "CANCELLED"
                    ? "bg-red-50 text-red-600 border border-red-100"
                    : "bg-amber-50 text-amber-700 border border-amber-100"
                }`}>
                  {o.status}
                </span>
                
                <select
                  value={o.status}
                  onChange={(e) => handleUpdateStatus(o.id, e.target.value as OrderItem["status"])}
                  className="bg-white border border-border text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg focus:outline-none"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            {/* Client and Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-text-secondary">
              <div className="space-y-2">
                <h4 className="text-[9px] uppercase tracking-widest text-text-muted font-bold">Client Information</h4>
                <p className="font-bold text-primary-dark text-sm">{o.name}</p>
                <p className="flex items-center gap-1.5 hover:text-gold-accent transition-colors">
                  <Phone className="w-3.5 h-3.5 text-text-muted" /> {o.phone}
                </p>
                <p className="flex items-start gap-1.5 leading-relaxed">
                  <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0 mt-0.5" /> {o.address}
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <h4 className="text-[9px] uppercase tracking-widest text-text-muted font-bold">Items Requested</h4>
                <p className="font-bold text-primary-dark text-sm leading-relaxed">{o.watches}</p>
                <div className="pt-2 flex items-center justify-between border-t border-border/40 mt-4">
                  <span className="text-text-muted">Inquiry Valuation:</span>
                  <span className="text-base font-bold text-gold-accent font-heading">₹{o.total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
