import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, forbiddenResponse } from "@/lib/session";
import { isUsingMockData } from "@/lib/watches";

const MOCK_USERS = [
  {
    id: "usr1", name: "Aarav Sharma", email: "aarav@email.com", role: "CUSTOMER", createdAt: new Date().toISOString(),
    orders: [
      { id: "ord1", total: 3200000, status: "DELIVERED", createdAt: new Date().toISOString() },
      { id: "ord2", total: 15000, status: "SHIPPED", createdAt: new Date().toISOString() },
    ],
  },
  {
    id: "usr2", name: "Priya Patel", email: "priya@email.com", role: "CUSTOMER", createdAt: new Date().toISOString(),
    orders: [
      { id: "ord3", total: 6850, status: "DELIVERED", createdAt: new Date().toISOString() },
    ],
  },
  {
    id: "usr3", name: "Kabir Mehta", email: "kabir@email.com", role: "CUSTOMER", createdAt: new Date().toISOString(),
    orders: [
      { id: "ord4", total: 13995, status: "PENDING", createdAt: new Date().toISOString() },
    ],
  },
  {
    id: "usr4", name: "Admin User", email: "admin@missqueen.com", role: "ADMIN", createdAt: new Date().toISOString(),
    orders: [],
  },
  {
    id: "usr5", name: "Sneha Reddy", email: "sneha@email.com", role: "CUSTOMER", createdAt: new Date().toISOString(),
    orders: [
      { id: "ord5", total: 45000, status: "SHIPPED", createdAt: new Date().toISOString() },
    ],
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return forbiddenResponse();

  const { id } = await params;

  if (isUsingMockData()) {
    const user = MOCK_USERS.find((u) => u.id === id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  }

  try {
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        orders: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            total: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
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
    const { role } = body;

    if (!role || !["ADMIN", "CUSTOMER"].includes(role)) {
      return NextResponse.json(
        { error: "Role must be ADMIN or CUSTOMER" },
        { status: 400 }
      );
    }

    if (isUsingMockData()) {
      const user = MOCK_USERS.find((u) => u.id === id);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json({ ...user, role, orders: undefined });
    }

    const existing = await db.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent admin from demoting themselves
    if (existing.id === session.user.id && role !== "ADMIN") {
      return NextResponse.json(
        { error: "You cannot change your own role" },
        { status: 400 }
      );
    }

    const user = await db.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
