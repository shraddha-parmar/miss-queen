"use client";

import { useState } from "react";
import { Plus, Search, Trash2, Edit2, X, AlertCircle } from "lucide-react";

interface WatchItem {
  id: string;
  sku: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  stock: number;
  status: string;
  description: string;
  thumbnailUrl: string;
  amazonUrl: string | null;
  flipkartUrl: string | null;
  meeshoUrl: string | null;
}

interface ProductsClientProps {
  initialWatches: WatchItem[];
}

export default function ProductsClient({ initialWatches }: ProductsClientProps) {
  const [watches, setWatches] = useState<WatchItem[]>(initialWatches);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWatch, setEditingWatch] = useState<WatchItem | null>(null);

  // Form Fields
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [amazonUrl, setAmazonUrl] = useState("");
  const [flipkartUrl, setFlipkartUrl] = useState("");
  const [meeshoUrl, setMeeshoUrl] = useState("");

  const handleOpenAddForm = () => {
    setEditingWatch(null);
    setSku(`MQ-${Math.floor(1000 + Math.random() * 9000)}`);
    setName("");
    setBrand("");
    setModel("");
    setPrice("");
    setStock("10");
    setStatus("ACTIVE");
    setDescription("");
    setThumbnailUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600");
    setAmazonUrl("");
    setFlipkartUrl("");
    setMeeshoUrl("");
    setIsFormOpen(true);
  };

  const handleEditClick = (watch: WatchItem) => {
    setEditingWatch(watch);
    setSku(watch.sku);
    setName(watch.name);
    setBrand(watch.brand);
    setModel(watch.model);
    setPrice(watch.price.toString());
    setStock(watch.stock.toString());
    setStatus(watch.status);
    setDescription(watch.description);
    setThumbnailUrl(watch.thumbnailUrl);
    setAmazonUrl(watch.amazonUrl || "");
    setFlipkartUrl(watch.flipkartUrl || "");
    setMeeshoUrl(watch.meeshoUrl || "");
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this timepiece from the active catalog?")) {
      setWatches(watches.filter((w) => w.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingWatch) {
      // Update existing
      setWatches(
        watches.map((w) =>
          w.id === editingWatch.id
            ? {
                ...w,
                sku,
                name,
                brand,
                model,
                price: parseFloat(price),
                stock: parseInt(stock),
                status,
                description,
                thumbnailUrl,
                amazonUrl: amazonUrl || null,
                flipkartUrl: flipkartUrl || null,
                meeshoUrl: meeshoUrl || null,
              }
            : w
        )
      );
    } else {
      // Add new
      const newWatch: WatchItem = {
        id: Math.random().toString(36).substr(2, 9),
        sku,
        name,
        brand,
        model,
        price: parseFloat(price),
        stock: parseInt(stock),
        status,
        description,
        thumbnailUrl,
        amazonUrl: amazonUrl || null,
        flipkartUrl: flipkartUrl || null,
        meeshoUrl: meeshoUrl || null,
      };
      setWatches([newWatch, ...watches]);
    }

    setIsFormOpen(false);
  };

  const filteredWatches = watches.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.brand.toLowerCase().includes(search.toLowerCase()) ||
      w.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
      
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search watches by brand, name, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-border pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-gold-accent transition-colors"
          />
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <button
          onClick={handleOpenAddForm}
          className="w-full sm:w-auto btn btn-accent px-6 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] tracking-widest font-bold"
        >
          <Plus className="w-4 h-4" /> Add Timepiece
        </button>
      </div>

      {/* Main Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border text-text-muted font-bold uppercase tracking-wider bg-soft-bg/30">
                <th className="p-4">Visual</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Watch Description</th>
                <th className="p-4 text-right">Price</th>
                <th className="p-4 text-center">Stock</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWatches.map((w) => (
                <tr key={w.id} className="border-b border-border/50 last:border-0 hover:bg-soft-bg/20 transition-colors">
                  <td className="p-4 shrink-0">
                    <img src={w.thumbnailUrl} alt={w.name} className="w-12 h-12 object-cover rounded-lg border border-border" />
                  </td>
                  <td className="p-4 font-mono font-bold text-primary-dark">{w.sku}</td>
                  <td className="p-4 text-text-secondary font-medium">{w.brand}</td>
                  <td className="p-4 max-w-xs truncate font-bold text-primary-dark" title={w.name}>{w.name}</td>
                  <td className="p-4 text-right font-bold text-primary-dark">₹{w.price.toLocaleString("en-IN")}</td>
                  <td className="p-4 text-center font-bold text-text-secondary">{w.stock}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      w.status === "ACTIVE"
                        ? "bg-green-50 text-green-700 border border-green-100"
                        : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                    }`}>
                      {w.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditClick(w)}
                        className="p-2 text-text-muted hover:text-gold-accent transition-colors rounded-lg hover:bg-soft-bg"
                        aria-label="Edit product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(w.id)}
                        className="p-2 text-text-muted hover:text-red-500 transition-colors rounded-lg hover:bg-soft-bg"
                        aria-label="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Form Panel */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsFormOpen(false)}></div>
          
          {/* Form container */}
          <div className="relative w-full max-w-xl bg-white shadow-2xl h-full flex flex-col z-10 transition-transform duration-300 animate-slide-in">
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-primary-dark text-white">
              <h3 className="font-heading text-lg tracking-wider uppercase">
                {editingWatch ? "Edit Timepiece" : "Add Timepiece"}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-white/60 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar pb-32">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-text-muted">SKU Code</label>
                  <input type="text" required value={sku} onChange={(e) => setSku(e.target.value)} className="w-full bg-soft-bg border border-border px-4 py-2.5 rounded-xl text-xs focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-white border border-border px-4 py-2.5 rounded-xl text-xs focus:outline-none">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="OUT_OF_STOCK">OUT OF STOCK</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Watch Full Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Swatch Rebel Black Watch" className="w-full bg-soft-bg border border-border px-4 py-2.5 rounded-xl text-xs focus:outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Brand Manufacturer</label>
                  <input type="text" required value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Swatch" className="w-full bg-soft-bg border border-border px-4 py-2.5 rounded-xl text-xs focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Model Reference</label>
                  <input type="text" required value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. SUOB702" className="w-full bg-soft-bg border border-border px-4 py-2.5 rounded-xl text-xs focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Price (INR)</label>
                  <input type="number" required min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="6850" className="w-full bg-soft-bg border border-border px-4 py-2.5 rounded-xl text-xs focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Initial Stock</label>
                  <input type="number" required min="0" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="70" className="w-full bg-soft-bg border border-border px-4 py-2.5 rounded-xl text-xs focus:outline-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Thumbnail Image URL</label>
                <input type="url" required value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} className="w-full bg-soft-bg border border-border px-4 py-2.5 rounded-xl text-xs focus:outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Description Narrative</label>
                <textarea rows={4} required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A cool modern monochromatic look..." className="w-full bg-soft-bg border border-border px-4 py-2.5 rounded-xl text-xs focus:outline-none resize-none" />
              </div>

              <div className="h-px bg-border/60 w-full my-4"></div>
              
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-gold-accent" /> Affiliate Retail Connections
                </span>
                
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider font-bold text-text-muted ml-1">Amazon Link</label>
                  <input type="url" value={amazonUrl} onChange={(e) => setAmazonUrl(e.target.value)} placeholder="https://amazon.in/..." className="w-full bg-soft-bg border border-border px-4 py-2.5 rounded-xl text-xs focus:outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider font-bold text-text-muted ml-1">Flipkart Link</label>
                  <input type="url" value={flipkartUrl} onChange={(e) => setFlipkartUrl(e.target.value)} placeholder="https://flipkart.com/..." className="w-full bg-soft-bg border border-border px-4 py-2.5 rounded-xl text-xs focus:outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider font-bold text-text-muted ml-1">Meesho Link</label>
                  <input type="url" value={meeshoUrl} onChange={(e) => setMeeshoUrl(e.target.value)} placeholder="https://meesho.com/..." className="w-full bg-soft-bg border border-border px-4 py-2.5 rounded-xl text-xs focus:outline-none" />
                </div>
              </div>

            </form>

            {/* Footer Form Actions */}
            <div className="absolute bottom-0 left-0 w-full p-6 border-t border-border bg-white flex gap-4">
              <button type="button" onClick={() => setIsFormOpen(false)} className="w-1/3 btn btn-secondary py-4.5 rounded-xl">
                Cancel
              </button>
              <button type="button" onClick={handleSubmit} className="w-2/3 btn btn-accent py-4.5 rounded-xl">
                {editingWatch ? "Save Changes" : "Create Product"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
