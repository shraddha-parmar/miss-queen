import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, forbiddenResponse } from "@/lib/session";
import { isUsingMockData } from "@/lib/watches";

// Mock products for when no DB is connected
const MOCK_PRODUCTS = [
  { id: "1", sku: "MQ-RLX-001", name: "Rolex Oyster Perpetual Day-Date", brand: "Rolex", model: "Day-Date 36", price: 3200000, stock: 2, status: "ACTIVE", description: "The Oyster Perpetual Day-Date embodies prestige.", thumbnailUrl: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=400", categoryId: "cat1", category: { id: "cat1", name: "Luxury", slug: "luxury" }, images: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "2", sku: "MQ-OMG-002", name: "Omega Seamaster Diver 300M", brand: "Omega", model: "Seamaster", price: 524900, stock: 5, status: "ACTIVE", description: "Built for deep-sea adventures.", thumbnailUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400", categoryId: "cat1", category: { id: "cat1", name: "Luxury", slug: "luxury" }, images: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "3", sku: "MQ-TDH-003", name: "TAG Heuer Carrera Calibre 16", brand: "TAG Heuer", model: "Carrera", price: 475000, stock: 3, status: "ACTIVE", description: "Legendary racing chronograph.", thumbnailUrl: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=400", categoryId: "cat2", category: { id: "cat2", name: "Sport", slug: "sport" }, images: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "4", sku: "MQ-CSO-004", name: "Casio G-Shock Mudmaster", brand: "Casio", model: "GWG-2000", price: 42995, stock: 12, status: "ACTIVE", description: "Built tough for extreme conditions.", thumbnailUrl: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=400", categoryId: "cat2", category: { id: "cat2", name: "Sport", slug: "sport" }, images: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "5", sku: "MQ-SKG-005", name: "Skagen Melbye Titanium", brand: "Skagen", model: "Melbye", price: 13995, stock: 8, status: "ACTIVE", description: "Danish minimalist design.", thumbnailUrl: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=400", categoryId: "cat3", category: { id: "cat3", name: "Casual", slug: "casual" }, images: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "6", sku: "MQ-SWT-006", name: "Swatch Rebel Black Strap", brand: "Swatch", model: "Rebel", price: 6850, stock: 20, status: "ACTIVE", description: "Bold, playful Swiss style.", thumbnailUrl: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=400", categoryId: "cat3", category: { id: "cat3", name: "Casual", slug: "casual" }, images: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "7", sku: "MQ-TST-007", name: "Tissot PRX Powermatic 80", brand: "Tissot", model: "PRX", price: 37500, stock: 0, status: "OUT_OF_STOCK", description: "Retro-modern integrated bracelet.", thumbnailUrl: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=400", categoryId: "cat1", category: { id: "cat1", name: "Luxury", slug: "luxury" }, images: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "8", sku: "MQ-HMT-008", name: "HMT Janata Classic", brand: "HMT", model: "Janata", price: 2499, stock: 15, status: "DRAFT", description: "Heritage Indian timepiece.", thumbnailUrl: "https://images.unsplash.com/photo-1585123334904-845d60e97b29?w=400", categoryId: "cat4", category: { id: "cat4", name: "Heritage", slug: "heritage" }, images: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

/**
 * Generate a SKU from brand name and a random suffix.
 */
function generateSku(brand: string): string {
  const prefix = brand
    .replace(/[^a-zA-Z]/g, "")
    .substring(0, 3)
    .toUpperCase();
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MQ-${prefix}-${suffix}`;
}

/**
 * GET /api/admin/products
 * List all watches with pagination, search, and filtering.
 * Query params: page, limit, search, category, status
 */
export async function GET(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return forbiddenResponse();

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const status = searchParams.get("status") || "";

  // ── Mock mode ────────────────────────────────────────────────
  if (isUsingMockData()) {
    let filtered = [...MOCK_PRODUCTS];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.brand.toLowerCase().includes(q) ||
          w.sku.toLowerCase().includes(q)
      );
    }

    if (category) {
      filtered = filtered.filter(
        (w) =>
          w.categoryId === category ||
          w.category.slug === category
      );
    }

    if (status) {
      filtered = filtered.filter((w) => w.status === status);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const items = filtered.slice((page - 1) * limit, page * limit);

    return NextResponse.json({ items, total, totalPages, page, limit });
  }

  // ── Database mode ────────────────────────────────────────────
  try {
    const where: Record<string, unknown> = { isDeleted: false };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (status) {
      where.status = status;
    }

    const [total, items] = await Promise.all([
      db.watch.count({ where }),
      db.watch.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          images: {
            orderBy: { sortOrder: "asc" },
            take: 1,
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ items, total, totalPages, page, limit });
  } catch (error) {
    console.error("Admin products GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/products
 * Create a new watch.
 */
export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return forbiddenResponse();

  try {
    const body = await request.json();

    const {
      name,
      brand,
      model,
      price,
      stock,
      status,
      description,
      thumbnailUrl,
      categoryId,
      sku,
      amazonUrl,
      flipkartUrl,
      meeshoUrl,
    } = body;

    // Validate required fields
    if (!name || !brand || !price) {
      return NextResponse.json(
        { error: "Name, brand, and price are required" },
        { status: 400 }
      );
    }

    if (typeof price !== "number" || price <= 0) {
      return NextResponse.json(
        { error: "Price must be a positive number" },
        { status: 400 }
      );
    }

    // ── Mock mode ──────────────────────────────────────────────
    if (isUsingMockData()) {
      const newProduct = {
        id: `mock-${Date.now()}`,
        sku: sku || generateSku(brand),
        name,
        brand,
        model: model || "",
        price,
        stock: stock ?? 0,
        status: status || "DRAFT",
        description: description || "",
        thumbnailUrl: thumbnailUrl || "",
        categoryId: categoryId || "",
        amazonUrl: amazonUrl || null,
        flipkartUrl: flipkartUrl || null,
        meeshoUrl: meeshoUrl || null,
        category: null,
        images: [],
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return NextResponse.json(newProduct, { status: 201 });
    }

    // ── Database mode ──────────────────────────────────────────
    const watch = await db.watch.create({
      data: {
        sku: sku || generateSku(brand),
        name,
        brand,
        model: model || "",
        price,
        stock: stock ?? 0,
        status: status || "DRAFT",
        description: description || "",
        thumbnailUrl: thumbnailUrl || "",
        categoryId: categoryId || undefined,
        amazonUrl: amazonUrl || null,
        flipkartUrl: flipkartUrl || null,
        meeshoUrl: meeshoUrl || null,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return NextResponse.json(watch, { status: 201 });
  } catch (error) {
    console.error("Admin products POST error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
