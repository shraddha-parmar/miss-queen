"use client";

import { useState } from "react";
import { Truck, Search, Eye, MapPin, Calendar } from "lucide-react";

interface ShipmentItem {
  id: string;
  orderId: string;
  recipient: string;
  carrier: string;
  trackingNumber: string;
  status: "IN_TRANSIT" | "OUT_FOR_DELIVERY" | "DELIVERED" | "HELD";
  lastLocation: string;
}

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<ShipmentItem[]>([
    {
      id: "SH-98310-X",
      orderId: "MQ-ORDER-8492",
      recipient: "Aarav Sharma",
      carrier: "DHL Express",
      trackingNumber: "DHL92840284",
      status: "IN_TRANSIT",
      lastLocation: "Delhi Hub - Sorting Center",
    },
    {
      id: "SH-12053-Z",
      orderId: "MQ-ORDER-1205",
      recipient: "Priya Patel",
      carrier: "FedEx International",
      trackingNumber: "FDX10283084",
      status: "DELIVERED",
      lastLocation: "Juhu Showroom Depot - Delivered Signature",
    },
  ]);

  const [search, setSearch] = useState("");

  const handleUpdateStatus = (id: string, newStatus: ShipmentItem["status"]) => {
    setShipments(
      shipments.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const filteredShipments = shipments.filter(
    (s) =>
      s.recipient.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.trackingNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading text-primary-dark tracking-wide uppercase">
          Logistics & Shipments
        </h1>
        <p className="text-text-muted text-xs font-medium tracking-wider uppercase mt-1">
          Monitor package dispatch progress, link courier tracking keys, and verify signatures.
        </p>
      </div>

      {/* Filters search */}
      <div className="relative w-full sm:w-80">
        <input
          type="text"
          placeholder="Search shipments by client, tracking, ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-border pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-gold-accent transition-colors"
        />
        <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* Shipments List */}
      <div className="space-y-6">
        {filteredShipments.map((ship) => (
          <div key={ship.id} className="card p-6 border border-border/80">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/60 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold-accent/15 text-gold-accent flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-mono font-bold text-sm text-primary-dark">{ship.id}</span>
                  <span className="text-[10px] text-text-muted font-sans font-medium uppercase tracking-wider block mt-0.5">
                    Order Ref: <strong className="text-primary-dark font-medium">{ship.orderId}</strong>
                  </span>
                </div>
              </div>

              {/* Status Action */}
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  ship.status === "DELIVERED"
                    ? "bg-green-50 text-green-700 border border-green-100"
                    : ship.status === "OUT_FOR_DELIVERY"
                    ? "bg-purple-50 text-purple-700 border border-purple-100"
                    : ship.status === "HELD"
                    ? "bg-red-50 text-red-600 border border-red-100"
                    : "bg-blue-50 text-blue-700 border border-blue-100"
                }`}>
                  {ship.status.replace(/_/g, " ")}
                </span>
                
                <select
                  value={ship.status}
                  onChange={(e) => handleUpdateStatus(ship.id, e.target.value as ShipmentItem["status"])}
                  className="bg-white border border-border text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg focus:outline-none"
                >
                  <option value="IN_TRANSIT">IN TRANSIT</option>
                  <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="HELD">HELD</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-text-secondary">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold block mb-1">Dispatch Logistics</span>
                <p>Courier: <strong className="text-primary-dark font-semibold">{ship.carrier}</strong></p>
                <p>Tracking: <strong className="text-primary-dark font-mono font-bold">{ship.trackingNumber}</strong></p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold block mb-1">Recipient client</span>
                <p className="font-semibold text-primary-dark">{ship.recipient}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold block mb-1">Last Logged Location</span>
                <p className="flex items-center gap-1.5 font-semibold text-primary-dark">
                  <MapPin className="w-3.5 h-3.5 text-gold-accent shrink-0" />
                  {ship.lastLocation}
                </p>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
