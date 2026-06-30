"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, AlertCircle, Loader2 } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  watchesCount: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/admin/categories");
      if (!res.ok) {
        throw new Error("Failed to load collections");
      }
      const data = await res.json();
      
      // Map API response categories list to CategoryItem interface
      const mapped: CategoryItem[] = (data.categories || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || "",
        imageUrl: c.imageUrl || "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800",
        watchesCount: c._count?.watches ?? 0,
      }));
      
      setCategories(mapped);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while loading collections.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAddForm = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setImageUrl("https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800");
    setIsFormOpen(true);
  };

  const handleEditClick = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setImageUrl(cat.imageUrl);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (!category) return;

    if (category.watchesCount > 0) {
      alert(`Cannot delete collection "${category.name}" because it still has ${category.watchesCount} timepiece(s) linked to it. Please reassign or delete the products first.`);
      return;
    }

    if (confirm(`Are you sure you want to delete this watch collection? All items mapping to it will lose their link.`)) {
      try {
        const res = await fetch(`/api/admin/categories/${id}`, {
          method: "DELETE",
        });
        const resData = await res.json();
        
        if (!res.ok) {
          throw new Error(resData.error || "Failed to delete collection");
        }
        
        setCategories(categories.filter((cat) => cat.id !== id));
      } catch (err: any) {
        alert(err.message || "Could not delete collection.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    try {
      setSubmitting(true);
      setError(null);
      
      const payload = {
        name,
        slug,
        description,
        imageUrl,
      };

      if (editingCategory) {
        // Edit category API call
        const res = await fetch(`/api/admin/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const resData = await res.json();

        if (!res.ok) {
          throw new Error(resData.error || "Failed to save changes");
        }

        setCategories(
          categories.map((c) =>
            c.id === editingCategory.id
              ? {
                  ...c,
                  name: resData.name,
                  slug: resData.slug,
                  description: resData.description || "",
                  imageUrl: resData.imageUrl || "",
                  watchesCount: resData._count?.watches ?? c.watchesCount,
                }
              : c
          )
        );
      } else {
        // Add new category API call
        const res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const resData = await res.json();

        if (!res.ok) {
          throw new Error(resData.error || "Failed to create collection");
        }

        const newCat: CategoryItem = {
          id: resData.id,
          name: resData.name,
          slug: resData.slug,
          description: resData.description || "",
          imageUrl: resData.imageUrl || "",
          watchesCount: 0,
        };
        
        setCategories([...categories, newCat]);
      }
      
      setIsFormOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to process collection form.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading text-primary-dark tracking-wide uppercase">
            Boutique Collections
          </h1>
          <p className="text-text-muted text-xs font-medium tracking-wider uppercase mt-1">
            Create and edit product categories to group your watch collections.
          </p>
        </div>
        <button
          onClick={handleOpenAddForm}
          className="btn btn-accent px-6 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] tracking-widest font-bold w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Add Collection
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-text-muted">
          <Loader2 className="w-8 h-8 animate-spin text-gold-accent" />
          <span className="text-xs uppercase tracking-widest font-bold">Synchronizing collections...</span>
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="card border border-red-200 bg-red-50 text-red-700 flex items-center gap-3 p-6">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="text-xs font-medium">{error}</div>
        </div>
      )}

      {/* Grid List */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.length === 0 ? (
            <div className="card col-span-full py-16 text-center text-text-muted">
              <span className="text-xs uppercase tracking-widest font-bold block mb-2">No Collections Found</span>
              <p className="text-[10px] uppercase font-medium">Click "Add Collection" above to begin your catalog.</p>
            </div>
          ) : (
            categories.map((cat) => (
              <div key={cat.id} className="card p-0 overflow-hidden flex flex-col group border border-border/80">
                <div className="relative h-48 bg-soft-bg overflow-hidden shrink-0">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-primary-dark/20 to-transparent flex items-end p-6">
                    <div>
                      <h3 className="font-heading text-lg text-white font-medium uppercase tracking-wide">
                        {cat.name}
                      </h3>
                      <span className="text-[10px] text-gold-accent font-bold uppercase tracking-widest block mt-0.5">
                        {cat.watchesCount} Items Listed
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between">
                  <p className="text-xs font-light text-text-secondary leading-relaxed mb-6">
                    {cat.description || "No description provided for this collection."}
                  </p>
                  
                  <div className="flex items-center justify-end gap-2 border-t border-border pt-4 mt-auto">
                    <button
                      onClick={() => handleEditClick(cat)}
                      className="p-2 text-text-muted hover:text-gold-accent transition-colors rounded-lg hover:bg-soft-bg"
                      aria-label="Edit collection"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 text-text-muted hover:text-red-500 transition-colors rounded-lg hover:bg-soft-bg"
                      aria-label="Delete collection"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal Dialog Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={() => !submitting && setIsFormOpen(false)}></div>
          <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl p-8 border border-border animate-scale-in">
            <button onClick={() => setIsFormOpen(false)} disabled={submitting} className="absolute top-6 right-6 text-text-muted hover:text-primary-dark transition-colors">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading text-xl uppercase tracking-wider text-primary-dark mb-6">
              {editingCategory ? "Edit Collection" : "Add Collection"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Collection Name</label>
                <input
                  type="text"
                  required
                  disabled={submitting}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                  }}
                  placeholder="e.g. Vintage Gold Edition"
                  className="w-full bg-soft-bg border border-border px-4 py-2.5 rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Slug URL Route</label>
                <input
                  type="text"
                  required
                  disabled={submitting}
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="vintage-gold-edition"
                  className="w-full bg-soft-bg border border-border px-4 py-2.5 rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Cover Image URL</label>
                <input
                  type="url"
                  required
                  disabled={submitting}
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-soft-bg border border-border px-4 py-2.5 rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Narrative Description</label>
                <textarea
                  rows={3}
                  disabled={submitting}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Elegant vintage gold designs..."
                  className="w-full bg-soft-bg border border-border px-4 py-2.5 rounded-xl text-xs focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" disabled={submitting} onClick={() => setIsFormOpen(false)} className="w-1/3 btn btn-secondary py-3.5 rounded-xl text-[10px]">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="w-2/3 btn btn-accent py-3.5 rounded-xl text-[10px] flex items-center justify-center gap-2">
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-dark" />}
                  {editingCategory ? "Save Changes" : "Create Collection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
