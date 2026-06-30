import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, forbiddenResponse } from "@/lib/session";
import { isUsingMockData } from "@/lib/watches";

// Mock categories (shared shape with the list route)
const MOCK_CATEGORIES = [
  { id: "cat1", name: "Luxury", slug: "luxury", description: "Premium timepieces from world-renowned maisons", imageUrl: null, isActive: true, _count: { watches: 3 }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "cat2", name: "Sport", slug: "sport", description: "Engineered for performance and durability", imageUrl: null, isActive: true, _count: { watches: 2 }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "cat3", name: "Casual", slug: "casual", description: "Everyday elegance for the modern individual", imageUrl: null, isActive: true, _count: { watches: 2 }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "cat4", name: "Heritage", slug: "heritage", description: "Classic designs honoring horological traditions", imageUrl: null, isActive: true, _count: { watches: 1 }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/admin/categories/[id]
 * Get a single category by ID with watch count.
 */
export async function GET(request: NextRequest, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) return forbiddenResponse();

  const { id } = await context.params;

  if (isUsingMockData()) {
    const category = MOCK_CATEGORIES.find((c) => c.id === id);
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(category);
  }

  try {
    const category = await db.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { watches: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/categories/[id]
 * Update category fields (name, slug, description, imageUrl, isActive).
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) return forbiddenResponse();

  const { id } = await context.params;

  try {
    const body = await request.json();
    const { name, slug, description, imageUrl, isActive } = body;

    if (isUsingMockData()) {
      const category = MOCK_CATEGORIES.find((c) => c.id === id);
      if (!category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }
      const updated = {
        ...category,
        ...(name !== undefined && { name: name.trim() }),
        ...(slug !== undefined && { slug: slug.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl?.trim() || null }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date().toISOString(),
      };
      return NextResponse.json(updated);
    }

    // Verify category exists
    const existing = await db.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // If slug is being changed, check for duplicates
    if (slug && slug.trim() !== existing.slug) {
      const slugConflict = await db.category.findFirst({
        where: { slug: slug.trim(), id: { not: id } },
      });
      if (slugConflict) {
        return NextResponse.json(
          { error: `A category with slug "${slug.trim()}" already exists` },
          { status: 409 }
        );
      }
    }

    const data: any = {};
    if (name !== undefined) data.name = name.trim();
    if (slug !== undefined) data.slug = slug.trim();
    if (description !== undefined) data.description = description?.trim() || null;
    if (imageUrl !== undefined) data.imageUrl = imageUrl?.trim() || null;
    if (isActive !== undefined) data.isActive = isActive;

    const updated = await db.category.update({
      where: { id },
      data,
      include: {
        _count: {
          select: { watches: true },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(`Error updating category ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/categories/[id]
 * Delete a category. Fails if watches are still linked to it.
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) return forbiddenResponse();

  const { id } = await context.params;

  if (isUsingMockData()) {
    const category = MOCK_CATEGORIES.find((c) => c.id === id);
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    if (category._count.watches > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category "${category.name}" — it still has ${category._count.watches} watch(es) linked to it. Reassign or remove them first.`,
        },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: "Category deleted successfully" });
  }

  try {
    const category = await db.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { watches: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    if (category._count.watches > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category "${category.name}" — it still has ${category._count.watches} watch(es) linked to it. Reassign or remove them first.`,
        },
        { status: 400 }
      );
    }

    await db.category.delete({ where: { id } });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
