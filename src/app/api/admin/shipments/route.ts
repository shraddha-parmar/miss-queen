import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, forbiddenResponse } from "@/lib/session";
import { isUsingMockData } from "@/lib/watches";
import { MOCK_ORDERS } from "../orders/route";
import { OrderStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return forbiddenResponse();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));

  if (isUsingMockData()) {
    const shipments = MOCK_ORDERS.filter(
      (o) => o.status === "SHIPPED" || o.status === "DELIVERED"
    );

    const total = shipments.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const items = shipments.slice(startIndex, startIndex + limit);

    return NextResponse.json({ items, total, totalPages, page, limit });
  }

  try {
    const where = {
      status: { in: ["SHIPPED", "DELIVERED"] as OrderStatus[] },
    };

    const [total, orders] = await Promise.all([
      db.order.count({ where }),
      db.order.findMany({
        where,
        orderBy: { updatedAt: "desc" },
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
    console.error("Admin shipments list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch shipments" },
      { status: 500 }
    );
  }
}
