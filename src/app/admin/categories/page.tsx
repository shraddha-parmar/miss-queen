"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, FolderTree, X } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  watchesCount: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([
    {
      id: "cat-unisex",
      name: "Unisex Collection",
      slug: "unisex",
      description: "Versatile and timeless watch designs suited for everyone.",
      imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800",
      watchesCount: 5,
    },
    {
      id: "cat-men",
      name: "Men's Collection",
      slug: "men",
      description: "Bold horological engineering and heritage style wristwatches.",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
      watchesCount: 3,
    },
    {
      id: "cat-women",
      name: "Women's Collection",
      slug: "women",
      description: "Elegant contours and classic refinement timepieces.",
      imageUrl: "https://images.unsplash.com/photo-1518131685504-766a6a12b19f?auto=format&fit=crop&q=80&w=800",
      watchesCount: 0,
    },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

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

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this watch collection? All items mapping to it will lose their link.")) {
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    if (editingCategory) {
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id
            ? { ...c, name, slug, description, imageUrl }
            : c
        )
      );
    } else {
      const newCat: CategoryItem = {
        id: `cat-${Math.random().toString(36).substr(2, 5)}`,
        name,
        slug,
        description,
        imageUrl,
        watchesCount: 0,
      };
      setCategories([...categories, newCat]);
    }
    setIsFormOpen(false);
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

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat) => (
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
        ))}
      </div>

      {/* Modal Dialog Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={() => setIsFormOpen(false)}></div>
          <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl p-8 border border-border animate-scale-in">
            <button onClick={() => setIsFormOpen(false)} className="absolute top-6 right-6 text-text-muted hover:text-primary-dark transition-colors">
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
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-soft-bg border border-border px-4 py-2.5 rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Narrative Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Elegant vintage gold designs..."
                  className="w-full bg-soft-bg border border-border px-4 py-2.5 rounded-xl text-xs focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsFormOpen(false)} className="w-1/3 btn btn-secondary py-3.5 rounded-xl text-[10px]">
                  Cancel
                </button>
                <button type="submit" className="w-2/3 btn btn-accent py-3.5 rounded-xl text-[10px]">
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
