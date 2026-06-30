import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, forbiddenResponse } from "@/lib/session";
import { isUsingMockData } from "@/lib/watches";

// Mock orders data for when no DB is connected
const MOCK_ORDERS = [
  { id: "ord1", user: { name: "Aarav Sharma", email: "aarav@email.com" }, items: [{ watch: { name: "Rolex Oyster Perpetual" }, quantity: 1, price: 3200000 }], total: 3200000, status: "SHIPPED", address: "12 MG Road, Mumbai", phone: "+91 98765 43210", trackingId: "TRK-8492-A", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "ord2", user: { name: "Priya Patel", email: "priya@email.com" }, items: [{ watch: { name: "Swatch Rebel Black" }, quantity: 2, price: 6850 }], total: 13700, status: "DELIVERED", address: "45 Park St, Kolkata", phone: "+91 87654 32109", trackingId: "TRK-1205-C", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "ord3", user: { name: "Kabir Mehta", email: "kabir@email.com" }, items: [{ watch: { name: "Skagen Melbye" }, quantity: 1, price: 13995 }], total: 13995, status: "PENDING", address: "78 Jubilee Hills, Hyderabad", phone: "+91 76543 21098", trackingId: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "ord4", user: { name: "Sneha Reddy", email: "sneha@email.com" }, items: [{ watch: { name: "TAG Heuer Carrera" }, quantity: 1, price: 475000 }], total: 475000, status: "PENDING", address: "23 Anna Nagar, Chennai", phone: "+91 65432 10987", trackingId: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "ord5", user: { name: "Rohit Kumar", email: "rohit@email.com" }, items: [{ watch: { name: "Casio G-Shock" }, quantity: 1, price: 42995 }], total: 42995, status: "CANCELLED", address: "56 Sector 17, Chandigarh", phone: "+91 54321 09876", trackingId: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export { MOCK_ORDERS };

export async function GET(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return forbiddenResponse();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));

  if (isUsingMockData()) {
    let filtered = [...MOCK_ORDERS];

    if (status && status !== "all") {
      filtered = filtered.filter((o) => o.status === status.toUpperCase());
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit);

    return NextResponse.json({ items, total, totalPages, page, limit });
  }

  try {
    const where: any = {};
    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    const [total, orders] = await Promise.all([
      db.order.count({ where }),
      db.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: {
            include: {
              watch: { select: { id: true, name: true, thumbnailUrl: true } },
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      items: orders,
      total,
      totalPages,
      page,
      limit,
    });
  } catch (error) {
    console.error("Admin orders list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
