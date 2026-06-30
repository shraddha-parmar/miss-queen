import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, forbiddenResponse } from "@/lib/session";
import { isUsingMockData } from "@/lib/watches";
import { MOCK_ORDERS } from "../route";

const VALID_STATUSES = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return forbiddenResponse();

  const { id } = await params;

  if (isUsingMockData()) {
    const order = MOCK_ORDERS.find((o) => o.id === id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  }

  try {
    const order = await db.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            watch: {
              select: {
                id: true,
                name: true,
                brand: true,
                thumbnailUrl: true,
                sku: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error(`Admin order GET error [${id}]:`, error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return forbiddenResponse();

  const { id } = await params;

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { status, trackingId } = body;

  // Validate status if provided
  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  // Must provide at least one field to update
  if (!status && trackingId === undefined) {
    return NextResponse.json(
      { error: "Provide at least one of: status, trackingId" },
      { status: 400 }
    );
  }

  if (isUsingMockData()) {
    const order = MOCK_ORDERS.find((o) => o.id === id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    // Return a simulated updated order (mock data is not actually mutated)
    return NextResponse.json({
      ...order,
      status: status || order.status,
      trackingId: trackingId !== undefined ? trackingId : order.trackingId,
      updatedAt: new Date().toISOString(),
    });
  }

  try {
    // Verify the order exists
    const existing = await db.order.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (trackingId !== undefined) updateData.trackingId = trackingId;

    const updated = await db.order.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            watch: {
              select: {
                id: true,
                name: true,
                brand: true,
                thumbnailUrl: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(`Admin order PUT error [${id}]:`, error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
