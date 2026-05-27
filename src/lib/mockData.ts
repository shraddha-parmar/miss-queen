export interface MockCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
}

export interface MockWatch {
  id: string;
  sku: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  stock: number;
  status: "ACTIVE" | "DRAFT" | "OUT_OF_STOCK";
  description: string;
  thumbnailUrl: string;
  amazonUrl: string | null;
  flipkartUrl: string | null;
  meeshoUrl: string | null;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  images: { id: string; imageUrl: string }[];
  reviews: any[];
}

export const MOCK_CATEGORIES: MockCategory[] = [
  {
    id: "cat-unisex",
    name: "Unisex",
    slug: "unisex",
    description: "Versatile and timeless designs for everyone.",
    imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "cat-men",
    name: "Men's Collection",
    slug: "men",
    description: "Bold horological engineering and heritage style.",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "cat-women",
    name: "Women's Collection",
    slug: "women",
    description: "Elegant contours and classic refinement.",
    imageUrl: "https://images.unsplash.com/photo-1518131685504-766a6a12b19f?auto=format&fit=crop&q=80&w=800",
  }
];

export const MOCK_WATCHES: MockWatch[] = [
  {
    id: "6a12822b7bf88cb3fdeeff26",
    sku: "U-SWA-20",
    name: "Swatch Rebel Black Silicone Strap Watch",
    brand: "Swatch",
    model: "Rebel Black SUOB702",
    price: 6850,
    stock: 70,
    status: "ACTIVE",
    description: "A cool modern monochromatic look with a black silicone strap, black dial, day-date window, and neon-green accent hands.",
    thumbnailUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600",
    categoryId: "cat-unisex",
    category: { id: "cat-unisex", name: "Unisex", slug: "unisex" },
    images: [{ id: "img-1", imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600" }],
    reviews: [],
    amazonUrl: null,
    flipkartUrl: null,
    meeshoUrl: null,
  },
  {
    id: "6a12822b7bf88cb3fdeeff24",
    sku: "U-DAN-19",
    name: "Daniel Wellington Iconic Link Emerald Watch",
    brand: "Daniel Wellington",
    model: "Emerald DW00100419",
    price: 18999,
    stock: 22,
    status: "ACTIVE",
    description: "A striking watch featuring a forest green dial, polished gold-tone case, and solid three-piece link bracelet.",
    thumbnailUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600",
    categoryId: "cat-unisex",
    category: { id: "cat-unisex", name: "Unisex", slug: "unisex" },
    images: [{ id: "img-2", imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600" }],
    reviews: [],
    amazonUrl: null,
    flipkartUrl: null,
    meeshoUrl: null,
  },
  {
    id: "6a12822a7bf88cb3fdeeff22",
    sku: "U-SKA-18",
    name: "Skagen Melbye Titanium Mesh Watch",
    brand: "Skagen",
    model: "Melbye SKW6007",
    price: 13995,
    stock: 25,
    status: "ACTIVE",
    description: "Lightweight grey titanium case with a blue accent line on the grey mesh dial, featuring a day-date indicator.",
    thumbnailUrl: "https://images.unsplash.com/photo-1518131685504-766a6a12b19f?auto=format&fit=crop&q=80&w=600",
    categoryId: "cat-men",
    category: { id: "cat-men", name: "Men's Collection", slug: "men" },
    images: [{ id: "img-3", imageUrl: "https://images.unsplash.com/photo-1518131685504-766a6a12b19f?auto=format&fit=crop&q=80&w=600" }],
    reviews: [],
    amazonUrl: null,
    flipkartUrl: null,
    meeshoUrl: null,
  },
  {
    id: "6a1282297bf88cb3fdeeff20",
    sku: "U-TIM-17",
    name: "Timex Easy Reader Date Leather Strap Watch",
    brand: "Timex",
    model: "Easy Reader T2H281",
    price: 3295,
    stock: 75,
    status: "ACTIVE",
    description: "A classic watch with an easy-to-read white dial, black leather band, date window, and full dial Indiglo.",
    thumbnailUrl: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=600",
    categoryId: "cat-unisex",
    category: { id: "cat-unisex", name: "Unisex", slug: "unisex" },
    images: [{ id: "img-4", imageUrl: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=600" }],
    reviews: [],
    amazonUrl: null,
    flipkartUrl: null,
    meeshoUrl: null,
  },
  {
    id: "6a1282287bf88cb3fdeeff1a",
    sku: "U-CAS-14",
    name: "Casio Vintage Calculator Alarm Watch",
    brand: "Casio",
    model: "Calculator CA-53W-1Z",
    price: 2495,
    stock: 90,
    status: "ACTIVE",
    description: "The iconic calculator watch featuring 8-digit calculator keys, dual time, stopwatch, and 5-year battery life.",
    thumbnailUrl: "https://images.unsplash.com/photo-1522312930-a17680226721?auto=format&fit=crop&q=80&w=600",
    categoryId: "cat-men",
    category: { id: "cat-men", name: "Men's Collection", slug: "men" },
    images: [{ id: "img-5", imageUrl: "https://images.unsplash.com/photo-1522312930-a17680226721?auto=format&fit=crop&q=80&w=600" }],
    reviews: [],
    amazonUrl: null,
    flipkartUrl: null,
    meeshoUrl: null,
  },
  {
    id: "6a1282277bf88cb3fdeeff12",
    sku: "U-FOS-10",
    name: "Fossil Neutra Minimalist Black Mesh Watch",
    brand: "Fossil",
    model: "Neutra FS5901",
    price: 9995,
    stock: 38,
    status: "ACTIVE",
    description: "Minimalist watch showcasing a matte black dial and stainless steel mesh strap with a security snap closure.",
    thumbnailUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600",
    categoryId: "cat-men",
    category: { id: "cat-men", name: "Men's Collection", slug: "men" },
    images: [{ id: "img-6", imageUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600" }],
    reviews: [],
    amazonUrl: null,
    flipkartUrl: null,
    meeshoUrl: null,
  },
  {
    id: "6a1282257bf88cb3fdeeff0a",
    sku: "U-TOM-06",
    name: "Tommy Hilfiger Minimalist Analog Metal Watch",
    brand: "Tommy Hilfiger",
    model: "Unisex TH1791622",
    price: 9995,
    stock: 35,
    status: "ACTIVE",
    description: "A sleek, low profile design with a standard mesh band, featuring the brand flag logo at 12 o'clock.",
    thumbnailUrl: "https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&q=80&w=600",
    categoryId: "cat-unisex",
    category: { id: "cat-unisex", name: "Unisex", slug: "unisex" },
    images: [{ id: "img-7", imageUrl: "https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&q=80&w=600" }],
    reviews: [],
    amazonUrl: null,
    flipkartUrl: null,
    meeshoUrl: null,
  },
  {
    id: "6a1282247bf88cb3fdeeff01",
    sku: "U-ROX-01",
    name: "Rolex Oyster Perpetual Day-Date 40 Gold",
    brand: "Rolex",
    model: "Oyster Gold 228238",
    price: 3200000,
    stock: 3,
    status: "ACTIVE",
    description: "The ultimate prestige timepiece in 18 ct yellow gold, featuring a fluted bezel and president bracelet.",
    thumbnailUrl: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=600",
    categoryId: "cat-men",
    category: { id: "cat-men", name: "Men's Collection", slug: "men" },
    images: [{ id: "img-8", imageUrl: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=600" }],
    reviews: [],
    amazonUrl: null,
    flipkartUrl: null,
    meeshoUrl: null,
  }
];
