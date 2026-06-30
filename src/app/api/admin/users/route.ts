import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, forbiddenResponse } from "@/lib/session";
import { isUsingMockData } from "@/lib/watches";

const MOCK_USERS = [
  { id: "usr1", name: "Aarav Sharma", email: "aarav@email.com", role: "CUSTOMER", _count: { orders: 2 }, createdAt: new Date().toISOString() },
  { id: "usr2", name: "Priya Patel", email: "priya@email.com", role: "CUSTOMER", _count: { orders: 1 }, createdAt: new Date().toISOString() },
  { id: "usr3", name: "Kabir Mehta", email: "kabir@email.com", role: "CUSTOMER", _count: { orders: 1 }, createdAt: new Date().toISOString() },
  { id: "usr4", name: "Admin User", email: "admin@missqueen.com", role: "ADMIN", _count: { orders: 0 }, createdAt: new Date().toISOString() },
  { id: "usr5", name: "Sneha Reddy", email: "sneha@email.com", role: "CUSTOMER", _count: { orders: 1 }, createdAt: new Date().toISOString() },
];

export async function GET(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return forbiddenResponse();

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  if (isUsingMockData()) {
    let filtered = [...MOCK_USERS];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }
    return NextResponse.json(filtered);
  }

  try {
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const users = await db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { orders: true },
        },
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(MOCK_USERS);
  }
}
