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

export async function GET(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return forbiddenResponse();

  const { searchParams } = new URL(request.url);
  const approvedParam = searchParams.get("isApproved");

  if (isUsingMockData()) {
    let filtered = [...MOCK_REVIEWS];
    if (approvedParam !== null) {
      const isApproved = approvedParam === "true";
      filtered = filtered.filter((r) => r.isApproved === isApproved);
    }
    return NextResponse.json(filtered);
  }

  try {
    const where: any = {};
    if (approvedParam !== null) {
      where.isApproved = approvedParam === "true";
    }

    const reviews = await db.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true },
        },
        watch: {
          select: { name: true, thumbnailUrl: true },
        },
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(MOCK_REVIEWS);
  }
}
