import { getWatches, getCategories } from "@/lib/watches";
import ProductsClient from "./ProductsClient";

export default async function AdminProductsPage() {
  // Fetch initial list of watches and categories
  const { items: initialWatches } = await getWatches({ limit: 100 });
  const categories = await getCategories();

  return (
    <div className="space-y-8">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading text-primary-dark tracking-wide uppercase">
            Timepiece Inventory
          </h1>
          <p className="text-text-muted text-xs font-medium tracking-wider uppercase mt-1">
            Manage your boutique's active catalog, stock quantities, and affiliate references.
          </p>
        </div>
      </div>

      {/* Main Client Table & CRUD controls */}
      <ProductsClient initialWatches={initialWatches} categories={categories} />
    </div>
  );
}
