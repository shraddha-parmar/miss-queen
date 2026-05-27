"use client";

import { useState } from "react";
import { Star, Check, Trash2, ShieldAlert } from "lucide-react";

interface ReviewItem {
  id: string;
  customerName: string;
  watchName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  date: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: "rev-1",
      customerName: "Aman Varma",
      watchName: "Swatch Rebel Black Silicone Strap Watch",
      rating: 5,
      comment: "Excellent sleek watch, really loved the neon accents. Totally recommend!",
      isApproved: false,
      date: "26 May 2026",
    },
    {
      id: "rev-2",
      customerName: "Pooja Sen",
      watchName: "Daniel Wellington Iconic Link Emerald Watch",
      rating: 4,
      comment: "Perfect styling. The green emerald color is gorgeous in sunlight. Fast delivery.",
      isApproved: true,
      date: "25 May 2026",
    },
  ]);

  const handleApprove = (id: string) => {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, isApproved: true } : r))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this review?")) {
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading text-primary-dark tracking-wide uppercase">
          Watch Reviews Mod
        </h1>
        <p className="text-text-muted text-xs font-medium tracking-wider uppercase mt-1">
          Approve or reject customer-submitted watch reviews for display on product pages.
        </p>
      </div>

      <div className="space-y-6">
        {reviews.map((rev) => (
          <div key={rev.id} className="card p-6 border border-border/80">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/50 pb-4 mb-4">
              <div>
                <p className="font-bold text-primary-dark text-sm">{rev.customerName}</p>
                <span className="text-[10px] text-text-muted font-sans font-medium uppercase tracking-wider block mt-0.5">
                  Watch: <strong className="text-primary-dark font-medium">{rev.watchName}</strong> • {rev.date}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  rev.isApproved
                    ? "bg-green-50 text-green-700 border border-green-100"
                    : "bg-amber-50 text-amber-700 border border-amber-100 flex items-center gap-1"
                }`}>
                  {!rev.isApproved && <ShieldAlert className="w-3 h-3" />}
                  {rev.isApproved ? "APPROVED" : "PENDING MODERATION"}
                </span>
              </div>
            </div>

            <div className="flex items-center text-gold-accent gap-0.5 mb-3" aria-label={`Rating: ${rev.rating} stars`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 stroke-none ${
                    i < rev.rating ? "fill-current" : "fill-border"
                  }`}
                />
              ))}
            </div>

            <p className="text-xs font-light text-text-secondary leading-relaxed mb-6">
              "{rev.comment}"
            </p>

            <div className="flex justify-end gap-3 border-t border-border/40 pt-4 mt-auto">
              {!rev.isApproved && (
                <button
                  onClick={() => handleApprove(rev.id)}
                  className="btn btn-accent px-4 py-2 rounded-lg flex items-center gap-1.5 text-[9px] tracking-wider font-bold"
                >
                  <Check className="w-3.5 h-3.5" /> Approve Display
                </button>
              )}
              <button
                onClick={() => handleDelete(rev.id)}
                className="btn btn-secondary px-4 py-2 rounded-lg flex items-center gap-1.5 text-[9px] tracking-wider font-bold text-red-600 hover:border-red-500 hover:text-red-600"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
