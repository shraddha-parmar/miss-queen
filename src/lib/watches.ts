import { db } from "./db";
import { MOCK_WATCHES, MOCK_CATEGORIES, MockWatch } from "./mockData";

// Helper to determine if we should use mock data or the database
export function isUsingMockData(): boolean {
  const url = process.env.DATABASE_URL;
  if (!url) return true;
  if (
    url.startsWith("prisma+postgres") ||
    url.includes("localhost") ||
    url.includes("your_username") ||
    url.includes("xxxxx")
  ) {
    return true;
  }
  return false;
}

export async function getCategories() {
  if (isUsingMockData()) {
    return MOCK_CATEGORIES;
  }
  try {
    return await db.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Database error in getCategories, falling back to mock:", error);
    return MOCK_CATEGORIES;
  }
}

export async function getWatches(filters: {
  brand?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const {
    brand,
    category,
    minPrice,
    maxPrice,
    sort = "newest",
    search,
    page = 1,
    limit = 10,
  } = filters;

  if (isUsingMockData()) {
    let filtered = [...MOCK_WATCHES];

    if (brand && brand !== "all") {
      filtered = filtered.filter((w) => w.brand.toLowerCase() === brand.toLowerCase());
    }
    if (category && category !== "all") {
      filtered = filtered.filter(
        (w) => w.category.slug === category || w.categoryId === category
      );
    }
    if (minPrice !== undefined) {
      filtered = filtered.filter((w) => w.price >= minPrice);
    }
    if (maxPrice !== undefined) {
      filtered = filtered.filter((w) => w.price <= maxPrice);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (w) => w.name.toLowerCase().includes(q) || w.brand.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sort === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      // newest
      filtered.sort((a, b) => b.price - a.price); // Mock newest sort by price as surrogate
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit);
    const totalPages = Math.ceil(total / limit);

    return { items, total, totalPages, page, limit };
  }

  // Database Query
  try {
    const where: any = { isDeleted: false, status: "ACTIVE" };

    if (brand && brand !== "all") {
      where.brand = { equals: brand, mode: "insensitive" };
    }
    if (category && category !== "all") {
      where.category = { slug: category };
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy: any = {};
    if (sort === "price-low") {
      orderBy.price = "asc";
    } else if (sort === "price-high") {
      orderBy.price = "desc";
    } else {
      orderBy.createdAt = "desc"; // newest
    }

    const total = await db.watch.count({ where });
    const items = await db.watch.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    const totalPages = Math.ceil(total / limit);

    return { items, total, totalPages, page, limit };
  } catch (error) {
    console.error("Database query failed in getWatches, falling back to mock:", error);
    // Fallback to mock logic in case database crashes
    return getWatches({ ...filters, limit: 8 }); 
  }
}

export async function getWatchById(id: string): Promise<any | null> {
  if (isUsingMockData()) {
    return MOCK_WATCHES.find((w) => w.id === id) || null;
  }
  try {
    return await db.watch.findFirst({
      where: { id, isDeleted: false },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: "desc" },
          include: { user: { select: { name: true } } },
        },
      },
    });
  } catch (error) {
    console.error(`Database query failed for watch ${id}, falling back to mock:`, error);
    return MOCK_WATCHES.find((w) => w.id === id) || null;
  }
}

export async function getTrendingWatches() {
  const result = await getWatches({ sort: "newest", limit: 4 });
  return result.items;
}
