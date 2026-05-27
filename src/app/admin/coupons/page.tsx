"use client";

import { useState } from "react";
import { Plus, Ticket, X, Calendar, Edit2, Trash2 } from "lucide-react";

interface CouponItem {
  id: string;
  code: string;
  discount: number;
  minSpend: number;
  isActive: boolean;
  validUntil: string;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>([
    { id: "cop-1", code: "LUXURY15", discount: 15, minSpend: 5000, isActive: true, validUntil: "31 Dec 2028" },
    { id: "cop-2", code: "WELCOME10", discount: 10, minSpend: 0, isActive: true, validUntil: "31 Dec 2028" },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponItem | null>(null);

  // Form Fields
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [minSpend, setMinSpend] = useState("");
  const [validUntil, setValidUntil] = useState("31 Dec 2028");

  const handleOpenAddForm = () => {
    setEditingCoupon(null);
    setCode("");
    setDiscount("");
    setMinSpend("0");
    setValidUntil("31 Dec 2028");
    setIsFormOpen(true);
  };

  const handleEditClick = (cop: CouponItem) => {
    setEditingCoupon(cop);
    setCode(cop.code);
    setDiscount(cop.discount.toString());
    setMinSpend(cop.minSpend.toString());
    setValidUntil(cop.validUntil);
    setIsFormOpen(true);
  };

  const handleToggleActive = (id: string) => {
    setCoupons(
      coupons.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Remove this promo coupon from active rules?")) {
      setCoupons(coupons.filter((c) => c.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discount) return;

    if (editingCoupon) {
      setCoupons(
        coupons.map((c) =>
          c.id === editingCoupon.id
            ? { ...c, code: code.toUpperCase().trim(), discount: parseFloat(discount), minSpend: parseFloat(minSpend), validUntil }
            : c
        )
      );
    } else {
      const newCop: CouponItem = {
        id: `cop-${Math.random().toString(36).substr(2, 5)}`,
        code: code.toUpperCase().trim(),
        discount: parseFloat(discount),
        minSpend: parseFloat(minSpend),
        isActive: true,
        validUntil,
      };
      setCoupons([...coupons, newCop]);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading text-primary-dark tracking-wide uppercase">
            Promo Coupons
          </h1>
          <p className="text-text-muted text-xs font-medium tracking-wider uppercase mt-1">
            Configure discounts and promotional codes for customer cart checkouts.
          </p>
        </div>
        <button
          onClick={handleOpenAddForm}
          className="btn btn-accent px-6 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] tracking-widest font-bold w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      {/* Coupons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {coupons.map((cop) => (
          <div key={cop.id} className="card p-6 border border-border/80 flex items-center justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-accent/15 text-gold-accent flex items-center justify-center">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-mono font-bold text-sm text-primary-dark tracking-wider">
                    {cop.code}
                  </h3>
                  <span className="text-[10px] text-text-muted font-sans font-medium uppercase tracking-wider block mt-0.5">
                    {cop.discount}% Cart Discount
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-text-secondary font-light">
                <p>• Minimum Purchase: <strong className="text-primary-dark font-medium">₹{cop.minSpend}</strong></p>
                <p className="flex items-center gap-1.5">• Valid Until: <Calendar className="w-3.5 h-3.5 text-text-muted" /> <strong className="text-primary-dark font-medium">{cop.validUntil}</strong></p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-end gap-4 justify-between h-full py-1">
              <button
                onClick={() => handleToggleActive(cop.id)}
                className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                  cop.isActive
                    ? "bg-green-50 text-green-700 border-green-100 hover:bg-green-100"
                    : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100"
                }`}
              >
                {cop.isActive ? "ACTIVE" : "PAUSED"}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditClick(cop)}
                  className="p-2 text-text-muted hover:text-gold-accent transition-colors rounded-lg hover:bg-soft-bg"
                  aria-label="Edit coupon"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cop.id)}
                  className="p-2 text-text-muted hover:text-red-500 transition-colors rounded-lg hover:bg-soft-bg"
                  aria-label="Delete coupon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={() => setIsFormOpen(false)}></div>
          <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl p-8 border border-border animate-scale-in">
            <button onClick={() => setIsFormOpen(false)} className="absolute top-6 right-6 text-text-muted hover:text-primary-dark transition-colors">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading text-xl uppercase tracking-wider text-primary-dark mb-6">
              {editingCoupon ? "Edit Coupon" : "Create Coupon"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Promo Code</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. SUMMER25"
                  className="w-full bg-soft-bg border border-border px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-widest uppercase focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Discount (%)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="15"
                    className="w-full bg-soft-bg border border-border px-4 py-2.5 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Min Spend (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={minSpend}
                    onChange={(e) => setMinSpend(e.target.value)}
                    placeholder="0"
                    className="w-full bg-soft-bg border border-border px-4 py-2.5 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Expiration Date</label>
                <input
                  type="text"
                  required
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  placeholder="31 Dec 2028"
                  className="w-full bg-soft-bg border border-border px-4 py-2.5 rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsFormOpen(false)} className="w-1/3 btn btn-secondary py-3.5 rounded-xl text-[10px]">
                  Cancel
                </button>
                <button type="submit" className="w-2/3 btn btn-accent py-3.5 rounded-xl text-[10px]">
                  {editingCoupon ? "Save Changes" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
