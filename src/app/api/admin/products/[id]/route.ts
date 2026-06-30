import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, forbiddenResponse } from "@/lib/session";
import { isUsingMockData } from "@/lib/watches";

// Mock products (same set used across admin products routes)
const MOCK_PRODUCTS = [
  { id: "1", sku: "MQ-RLX-001", name: "Rolex Oyster Perpetual Day-Date", brand: "Rolex", model: "Day-Date 36", price: 3200000, stock: 2, status: "ACTIVE", description: "The Oyster Perpetual Day-Date embodies prestige.", thumbnailUrl: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=400", categoryId: "cat1", category: { id: "cat1", name: "Luxury", slug: "luxury" }, images: [], amazonUrl: null, flipkartUrl: null, meeshoUrl: null, isDeleted: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "2", sku: "MQ-OMG-002", name: "Omega Seamaster Diver 300M", brand: "Omega", model: "Seamaster", price: 524900, stock: 5, status: "ACTIVE", description: "Built for deep-sea adventures.", thumbnailUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400", categoryId: "cat1", category: { id: "cat1", name: "Luxury", slug: "luxury" }, images: [], amazonUrl: null, flipkartUrl: null, meeshoUrl: null, isDeleted: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "3", sku: "MQ-TDH-003", name: "TAG Heuer Carrera Calibre 16", brand: "TAG Heuer", model: "Carrera", price: 475000, stock: 3, status: "ACTIVE", description: "Legendary racing chronograph.", thumbnailUrl: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=400", categoryId: "cat2", category: { id: "cat2", name: "Sport", slug: "sport" }, images: [], amazonUrl: null, flipkartUrl: null, meeshoUrl: null, isDeleted: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "4", sku: "MQ-CSO-004", name: "Casio G-Shock Mudmaster", brand: "Casio", model: "GWG-2000", price: 42995, stock: 12, status: "ACTIVE", description: "Built tough for extreme conditions.", thumbnailUrl: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=400", categoryId: "cat2", category: { id: "cat2", name: "Sport", slug: "sport" }, images: [], amazonUrl: null, flipkartUrl: null, meeshoUrl: null, isDeleted: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "5", sku: "MQ-SKG-005", name: "Skagen Melbye Titanium", brand: "Skagen", model: "Melbye", price: 13995, stock: 8, status: "ACTIVE", description: "Danish minimalist design.", thumbnailUrl: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=400", categoryId: "cat3", category: { id: "cat3", name: "Casual", slug: "casual" }, images: [], amazonUrl: null, flipkartUrl: null, meeshoUrl: null, isDeleted: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "6", sku: "MQ-SWT-006", name: "Swatch Rebel Black Strap", brand: "Swatch", model: "Rebel", price: 6850, stock: 20, status: "ACTIVE", description: "Bold, playful Swiss style.", thumbnailUrl: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=400", categoryId: "cat3", category: { id: "cat3", name: "Casual", slug: "casual" }, images: [], amazonUrl: null, flipkartUrl: null, meeshoUrl: null, isDeleted: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "7", sku: "MQ-TST-007", name: "Tissot PRX Powermatic 80", brand: "Tissot", model: "PRX", price: 37500, stock: 0, status: "OUT_OF_STOCK", description: "Retro-modern integrated bracelet.", thumbnailUrl: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=400", categoryId: "cat1", category: { id: "cat1", name: "Luxury", slug: "luxury" }, images: [], amazonUrl: null, flipkartUrl: null, meeshoUrl: null, isDeleted: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "8", sku: "MQ-HMT-008", name: "HMT Janata Classic", brand: "HMT", model: "Janata", price: 2499, stock: 15, status: "DRAFT", description: "Heritage Indian timepiece.", thumbnailUrl: "https://images.unsplash.com/photo-1585123334904-845d60e97b29?w=400", categoryId: "cat4", category: { id: "cat4", name: "Heritage", slug: "heritage" }, images: [], amazonUrl: null, flipkartUrl: null, meeshoUrl: null, isDeleted: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/admin/products/[id]
 * Get a single watch by ID with category and images.
 */
export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  const session = await requireAdmin();
  if (!session) return forbiddenResponse();

  const { id } = await context.params;

  // ── Mock mode ────────────────────────────────────────────────
  if (isUsingMockData()) {
    const product = MOCK_PRODUCTS.find((p) => p.id === id);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(product);
  }

  // ── Database mode ────────────────────────────────────────────
  try {
    const watch = await db.watch.findFirst({
      where: { id, isDeleted: false },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!watch) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(watch);
  } catch (error) {
    console.error(`Admin product GET [${id}] error:`, error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/products/[id]
 * Update watch fields.
 */
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  const session = await requireAdmin();
  if (!session) return forbiddenResponse();

  const { id } = await context.params;

  try {
    const body = await request.json();

    // Only allow known fields to be updated
    const allowedFields = [
      "name",
      "brand",
      "model",
      "price",
      "stock",
      "status",
      "description",
      "thumbnailUrl",
      "categoryId",
      "sku",
      "amazonUrl",
      "flipkartUrl",
      "meeshoUrl",
    ] as const;

    const data: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        data[field] = body[field];
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update" },
        { status: 400 }
      );
    }

    // Validate price if being updated
    if (data.price !== undefined) {
      if (typeof data.price !== "number" || (data.price as number) <= 0) {
        return NextResponse.json(
          { error: "Price must be a positive number" },
          { status: 400 }
        );
      }
    }

    // ── Mock mode ──────────────────────────────────────────────
    if (isUsingMockData()) {
      const product = MOCK_PRODUCTS.find((p) => p.id === id);
      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      const updated = {
        ...product,
        ...data,
        updatedAt: new Date().toISOString(),
      };

      return NextResponse.json(updated);
    }

    // ── Database mode ──────────────────────────────────────────
    // Check product exists and is not deleted
    const existing = await db.watch.findFirst({
      where: { id, isDeleted: false },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const watch = await db.watch.update({
      where: { id },
      data,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return NextResponse.json(watch);
  } catch (error) {
    console.error(`Admin product PUT [${id}] error:`, error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/products/[id]
 * Soft delete — sets isDeleted = true.
 */
export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  const session = await requireAdmin();
  if (!session) return forbiddenResponse();

  const { id } = await context.params;

  // ── Mock mode ────────────────────────────────────────────────
  if (isUsingMockData()) {
    const product = MOCK_PRODUCTS.find((p) => p.id === id);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  }

  // ── Database mode ────────────────────────────────────────────
  try {
    const existing = await db.watch.findFirst({
      where: { id, isDeleted: false },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    await db.watch.update({
      where: { id },
      data: { isDeleted: true },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(`Admin product DELETE [${id}] error:`, error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
