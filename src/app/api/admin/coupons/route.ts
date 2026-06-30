import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, forbiddenResponse } from "@/lib/session";
import { isUsingMockData } from "@/lib/watches";

const MOCK_COUPONS = [
  { id: "coup1", code: "WELCOME10", discount: 10, minSpend: 5000, isActive: true, validUntil: new Date("2026-12-31").toISOString(), createdAt: new Date().toISOString() },
  { id: "coup2", code: "LUXURY20", discount: 20, minSpend: 100000, isActive: true, validUntil: new Date("2026-09-30").toISOString(), createdAt: new Date().toISOString() },
  { id: "coup3", code: "SUMMER15", discount: 15, minSpend: 10000, isActive: false, validUntil: new Date("2026-06-30").toISOString(), createdAt: new Date().toISOString() },
];

export async function GET() {
  const session = await requireAdmin();
  if (!session) return forbiddenResponse();

  if (isUsingMockData()) {
    return NextResponse.json(MOCK_COUPONS);
  }

  try {
    const coupons = await db.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(coupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json(MOCK_COUPONS);
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return forbiddenResponse();

  try {
    const body = await request.json();
    const { code, discount, minSpend, isActive, validUntil } = body;

    if (!code || discount === undefined || !validUntil) {
      return NextResponse.json(
        { error: "Code, discount, and validUntil are required" },
        { status: 400 }
      );
    }

    if (discount < 0 || discount > 100) {
      return NextResponse.json(
        { error: "Discount must be between 0 and 100" },
        { status: 400 }
      );
    }

    if (isUsingMockData()) {
      const newCoupon = {
        id: `coup${Date.now()}`,
        code: code.toUpperCase(),
        discount,
        minSpend: minSpend || 0,
        isActive: isActive ?? true,
        validUntil: validUntil,
        createdAt: new Date().toISOString(),
      };
      return NextResponse.json(newCoupon, { status: 201 });
    }

    const existing = await db.coupon.findFirst({
      where: { code: code.toUpperCase() },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Coupon code already exists" },
        { status: 409 }
      );
    }

    const coupon = await db.coupon.create({
      data: {
        code: code.toUpperCase(),
        discount,
        minSpend: minSpend || 0,
        isActive: isActive ?? true,
        validUntil: new Date(validUntil),
      },
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return NextResponse.json(
      { error: "Failed to create coupon" },
      { status: 500 }
    );
  }
}
