import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, forbiddenResponse } from "@/lib/session";
import { isUsingMockData } from "@/lib/watches";

// Mock dashboard stats for when no DB is connected
const MOCK_STATS = {
  totalRevenue: 154800,
  totalOrders: 14,
  totalWatches: 8,
  totalUsers: 42,
  totalReviews: 23,
  activeCoupons: 2,
  pendingOrders: 3,
  monthlyRevenue: [45, 60, 52, 78, 65, 88, 92, 110, 85, 95, 125, 140],
  recentOrders: [
    { id: "MQ-8492-A", customer: "Aarav Sharma", watch: "Rolex Oyster Perpetual Day-Date", total: 3200000, status: "SHIPPED", date: "24 May 2026" },
    { id: "MQ-1205-C", customer: "Priya Patel", watch: "Swatch Rebel Black Strap", total: 6850, status: "DELIVERED", date: "23 May 2026" },
    { id: "MQ-9831-D", customer: "Kabir Mehta", watch: "Skagen Melbye Titanium", total: 13995, status: "PENDING", date: "22 May 2026" },
  ],
};

export async function GET() {
  const session = await requireAdmin();
  if (!session) return forbiddenResponse();

  if (isUsingMockData()) {
    return NextResponse.json(MOCK_STATS);
  }

  try {
    const [watches, orders, users, reviews, coupons] = await Promise.all([
      db.watch.count({ where: { isDeleted: false } }),
      db.order.findMany({
        select: { total: true, status: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      }),
      db.user.count(),
      db.review.count(),
      db.coupon.count({ where: { isActive: true } }),
    ]);

    const recentOrders = await db.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        items: {
          include: { watch: { select: { name: true } } },
          take: 1,
        },
      },
    });

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = orders.filter((o) => o.status === "PENDING").length;

    return NextResponse.json({
      totalRevenue,
      totalOrders: orders.length,
      totalWatches: watches,
      totalUsers: users,
      totalReviews: reviews,
      activeCoupons: coupons,
      pendingOrders,
      recentOrders: recentOrders.map((o) => ({
        id: o.id.slice(-8).toUpperCase(),
        customer: o.user.name || o.user.email,
        watch: o.items[0]?.watch?.name || "Multiple items",
        total: o.total,
        status: o.status,
        date: o.createdAt.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      })),
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(MOCK_STATS);
  }
}
