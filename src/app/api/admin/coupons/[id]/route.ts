import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, forbiddenResponse } from "@/lib/session";
import { isUsingMockData } from "@/lib/watches";

const MOCK_COUPONS = [
  { id: "coup1", code: "WELCOME10", discount: 10, minSpend: 5000, isActive: true, validUntil: new Date("2026-12-31").toISOString(), createdAt: new Date().toISOString() },
  { id: "coup2", code: "LUXURY20", discount: 20, minSpend: 100000, isActive: true, validUntil: new Date("2026-09-30").toISOString(), createdAt: new Date().toISOString() },
  { id: "coup3", code: "SUMMER15", discount: 15, minSpend: 10000, isActive: false, validUntil: new Date("2026-06-30").toISOString(), createdAt: new Date().toISOString() },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return forbiddenResponse();

  const { id } = await params;

  if (isUsingMockData()) {
    const coupon = MOCK_COUPONS.find((c) => c.id === id);
    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
    return NextResponse.json(coupon);
  }

  try {
    const coupon = await db.coupon.findUnique({ where: { id } });
    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
    return NextResponse.json(coupon);
  } catch (error) {
    console.error("Error fetching coupon:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupon" },
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

  try {
    const body = await request.json();
    const { code, discount, minSpend, isActive, validUntil } = body;

    if (discount !== undefined && (discount < 0 || discount > 100)) {
      return NextResponse.json(
        { error: "Discount must be between 0 and 100" },
        { status: 400 }
      );
    }

    if (isUsingMockData()) {
      const coupon = MOCK_COUPONS.find((c) => c.id === id);
      if (!coupon) {
        return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
      }
      return NextResponse.json({
        ...coupon,
        ...(code !== undefined && { code: code.toUpperCase() }),
        ...(discount !== undefined && { discount }),
        ...(minSpend !== undefined && { minSpend }),
        ...(isActive !== undefined && { isActive }),
        ...(validUntil !== undefined && { validUntil }),
      });
    }

    const existing = await db.coupon.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    const data: any = {};
    if (code !== undefined) data.code = code.toUpperCase();
    if (discount !== undefined) data.discount = discount;
    if (minSpend !== undefined) data.minSpend = minSpend;
    if (isActive !== undefined) data.isActive = isActive;
    if (validUntil !== undefined && validUntil !== null) data.validUntil = new Date(validUntil);

    const coupon = await db.coupon.update({
      where: { id },
      data,
    });

    return NextResponse.json(coupon);
  } catch (error) {
    console.error("Error updating coupon:", error);
    return NextResponse.json(
      { error: "Failed to update coupon" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return forbiddenResponse();

  const { id } = await params;

  if (isUsingMockData()) {
    const coupon = MOCK_COUPONS.find((c) => c.id === id);
    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Coupon deleted successfully" });
  }

  try {
    const existing = await db.coupon.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    await db.coupon.delete({ where: { id } });
    return NextResponse.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json(
      { error: "Failed to delete coupon" },
      { status: 500 }
    );
  }
}
