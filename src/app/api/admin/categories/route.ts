import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, forbiddenResponse } from "@/lib/session";
import { isUsingMockData } from "@/lib/watches";

// Mock categories for when no DB is connected
const MOCK_CATEGORIES = [
  { id: "cat1", name: "Luxury", slug: "luxury", description: "Premium timepieces from world-renowned maisons", imageUrl: null, isActive: true, _count: { watches: 3 }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "cat2", name: "Sport", slug: "sport", description: "Engineered for performance and durability", imageUrl: null, isActive: true, _count: { watches: 2 }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "cat3", name: "Casual", slug: "casual", description: "Everyday elegance for the modern individual", imageUrl: null, isActive: true, _count: { watches: 2 }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "cat4", name: "Heritage", slug: "heritage", description: "Classic designs honoring horological traditions", imageUrl: null, isActive: true, _count: { watches: 1 }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

/**
 * Generate a URL-friendly slug from a string.
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * GET /api/admin/categories
 * List all categories with watch count. Supports ?search= query param.
 */
export async function GET(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return forbiddenResponse();

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() || "";

  if (isUsingMockData()) {
    let categories = [...MOCK_CATEGORIES];
    if (search) {
      const q = search.toLowerCase();
      categories = categories.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q))
      );
    }
    return NextResponse.json({ categories, total: categories.length });
  }

  try {
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const categories = await db.category.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { watches: true },
        },
      },
    });

    return NextResponse.json({ categories, total: categories.length });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/categories
 * Create a new category. Accepts JSON: name, slug?, description?, imageUrl?.
 */
export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return forbiddenResponse();

  try {
    const body = await request.json();
    const { name, slug, description, imageUrl } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    const finalSlug = slug?.trim() || generateSlug(name);

    if (isUsingMockData()) {
      const newCategory = {
        id: `cat${Date.now()}`,
        name: name.trim(),
        slug: finalSlug,
        description: description?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        isActive: true,
        _count: { watches: 0 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return NextResponse.json(newCategory, { status: 201 });
    }

    // Check for duplicate slug
    const existing = await db.category.findFirst({
      where: { slug: finalSlug },
    });
    if (existing) {
      return NextResponse.json(
        { error: `A category with slug "${finalSlug}" already exists` },
        { status: 409 }
      );
    }

    const category = await db.category.create({
      data: {
        name: name.trim(),
        slug: finalSlug,
        description: description?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        isActive: true,
      },
      include: {
        _count: {
          select: { watches: true },
        },
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
