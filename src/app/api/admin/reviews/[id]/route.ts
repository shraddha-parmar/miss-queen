import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, forbiddenResponse } from "@/lib/session";
import { isUsingMockData } from "@/lib/watches";

const MOCK_REVIEWS = [
  { id: "rev1", user: { name: "Aarav Sharma", email: "aarav@email.com" }, watch: { name: "Rolex Oyster Perpetual", thumbnailUrl: "" }, rating: 5, comment: "Absolutely stunning timepiece. The craftsmanship is beyond compare.", isApproved: true, createdAt: new Date().toISOString() },
  { id: "rev2", user: { name: "Priya Patel", email: "priya@email.com" }, watch: { name: "Swatch Rebel Black", thumbnailUrl: "" }, rating: 4, comment: "Great value for money. Love the playful design.", isApproved: true, createdAt: new Date().toISOString() },
  { id: "rev3", user: { name: "Kabir Mehta", email: "kabir@email.com" }, watch: { name: "Skagen Melbye", thumbnailUrl: "" }, rating: 5, comment: "Minimalist perfection. Gets compliments everywhere.", isApproved: false, createdAt: new Date().toISOString() },
  { id: "rev4", user: { name: "Sneha Reddy", email: "sneha@email.com" }, watch: { name: "TAG Heuer Carrera", thumbnailUrl: "" }, rating: 3, comment: "Nice watch but the strap could be more comfortable.", isApproved: false, createdAt: new Date().toISOString() },
];

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return forbiddenResponse();

  const { id } = await params;

  try {
    const body = await request.json();
    const { isApproved } = body;

    if (typeof isApproved !== "boolean") {
      return NextResponse.json(
        { error: "isApproved must be a boolean" },
        { status: 400 }
      );
    }

    if (isUsingMockData()) {
      const review = MOCK_REVIEWS.find((r) => r.id === id);
      if (!review) {
        return NextResponse.json({ error: "Review not found" }, { status: 404 });
      }
      return NextResponse.json({ ...review, isApproved });
    }

    const existing = await db.review.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const review = await db.review.update({
      where: { id },
      data: { isApproved },
      include: {
        user: { select: { name: true, email: true } },
        watch: { select: { name: true, thumbnailUrl: true } },
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}
