import { PrismaClient, Role, ProductStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing collections if they exist (optional, but good for reset)
  // MongoDB doesn't support truncate, so we delete many.
  await prisma.review.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.watchImage.deleteMany({});
  await prisma.watch.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.coupon.deleteMany({});

  // 1. Create Default Admin & Customer users
  const hashedPassword = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@missqueen.com",
      name: "Miss Queen Admin",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: "customer@missqueen.com",
      name: "John Doe",
      password: hashedPassword,
      role: Role.CUSTOMER,
    },
  });

  // 2. Create Categories
  const unisexCategory = await prisma.category.create({
    data: {
      name: "Unisex",
      slug: "unisex",
      description: "Versatile and timeless designs for everyone.",
      imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800",
    },
  });

  const menCategory = await prisma.category.create({
    data: {
      name: "Men's Collection",
      slug: "men",
      description: "Bold horological engineering and heritage style.",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
    },
  });

  const womenCategory = await prisma.category.create({
    data: {
      name: "Women's Collection",
      slug: "women",
      description: "Elegant contours and classic refinement.",
      imageUrl: "https://images.unsplash.com/photo-1518131685504-766a6a12b19f?auto=format&fit=crop&q=80&w=800",
    },
  });

  // 3. Create Watch Products
  const watchData = [
    {
      sku: "U-SWA-20",
      name: "Swatch Rebel Black Silicone Strap Watch",
      brand: "Swatch",
      model: "Rebel Black SUOB702",
      price: 6850,
      stock: 70,
      status: ProductStatus.ACTIVE,
      description: "A cool modern monochromatic look with a black silicone strap, black dial, day-date window, and neon-green accent hands.",
      thumbnailUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600",
      categoryId: unisexCategory.id,
      images: [
        "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600"
      ]
    },
    {
      sku: "U-DAN-19",
      name: "Daniel Wellington Iconic Link Emerald Watch",
      brand: "Daniel Wellington",
      model: "Emerald DW00100419",
      price: 18999,
      stock: 22,
      status: ProductStatus.ACTIVE,
      description: "A striking watch featuring a forest green dial, polished gold-tone case, and solid three-piece link bracelet.",
      thumbnailUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600",
      categoryId: unisexCategory.id,
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600"
      ]
    },
    {
      sku: "U-SKA-18",
      name: "Skagen Melbye Titanium Mesh Watch",
      brand: "Skagen",
      model: "Melbye SKW6007",
      price: 13995,
      stock: 25,
      status: ProductStatus.ACTIVE,
      description: "Lightweight grey titanium case with a blue accent line on the grey mesh dial, featuring a day-date indicator.",
      thumbnailUrl: "https://images.unsplash.com/photo-1518131685504-766a6a12b19f?auto=format&fit=crop&q=80&w=600",
      categoryId: menCategory.id,
      images: [
        "https://images.unsplash.com/photo-1518131685504-766a6a12b19f?auto=format&fit=crop&q=80&w=600"
      ]
    },
    {
      sku: "U-TIM-17",
      name: "Timex Easy Reader Date Leather Strap Watch",
      brand: "Timex",
      model: "Easy Reader T2H281",
      price: 3295,
      stock: 75,
      status: ProductStatus.ACTIVE,
      description: "A classic watch with an easy-to-read white dial, black leather band, date window, and full dial Indiglo.",
      thumbnailUrl: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=600",
      categoryId: unisexCategory.id,
      images: [
        "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=600"
      ]
    },
    {
      sku: "U-CAS-14",
      name: "Casio Vintage Calculator Alarm Watch",
      brand: "Casio",
      model: "Calculator CA-53W-1Z",
      price: 2495,
      stock: 90,
      status: ProductStatus.ACTIVE,
      description: "The iconic calculator watch featuring 8-digit calculator keys, dual time, stopwatch, and 5-year battery life.",
      thumbnailUrl: "https://images.unsplash.com/photo-1522312930-a17680226721?auto=format&fit=crop&q=80&w=600",
      categoryId: menCategory.id,
      images: [
        "https://images.unsplash.com/photo-1522312930-a17680226721?auto=format&fit=crop&q=80&w=600"
      ]
    },
    {
      sku: "U-FOS-10",
      name: "Fossil Neutra Minimalist Black Mesh Watch",
      brand: "Fossil",
      model: "Neutra FS5901",
      price: 9995,
      stock: 38,
      status: ProductStatus.ACTIVE,
      description: "Minimalist watch showcasing a matte black dial and stainless steel mesh strap with a security snap closure.",
      thumbnailUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600",
      categoryId: menCategory.id,
      images: [
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600"
      ]
    },
    {
      sku: "U-TOM-06",
      name: "Tommy Hilfiger Minimalist Analog Metal Watch",
      brand: "Tommy Hilfiger",
      model: "Unisex TH1791622",
      price: 9995,
      stock: 35,
      status: ProductStatus.ACTIVE,
      description: "A sleek, low profile design with a standard mesh band, featuring the brand flag logo at 12 o'clock.",
      thumbnailUrl: "https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&q=80&w=600",
      categoryId: unisexCategory.id,
      images: [
        "https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&q=80&w=600"
      ]
    },
    {
      sku: "U-ROX-01",
      name: "Rolex Oyster Perpetual Day-Date 40 Gold",
      brand: "Rolex",
      model: "Oyster Gold 228238",
      price: 3200000,
      stock: 3,
      status: ProductStatus.ACTIVE,
      description: "The ultimate prestige timepiece in 18 ct yellow gold, featuring a fluted bezel and president bracelet.",
      thumbnailUrl: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=600",
      categoryId: menCategory.id,
      images: [
        "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=600"
      ]
    }
  ];

  for (const item of watchData) {
    const { images, ...watchFields } = item;
    const watch = await prisma.watch.create({
      data: watchFields
    });
    
    // Create image objects
    for (let i = 0; i < images.length; i++) {
      await prisma.watchImage.create({
        data: {
          watchId: watch.id,
          imageUrl: images[i],
          sortOrder: i + 1
        }
      });
    }
  }

  // 4. Create Coupons
  await prisma.coupon.create({
    data: {
      code: "LUXURY15",
      discount: 15,
      minSpend: 5000,
      isActive: true,
      validUntil: new Date("2028-12-31"),
    }
  });

  await prisma.coupon.create({
    data: {
      code: "WELCOME10",
      discount: 10,
      minSpend: 0,
      isActive: true,
      validUntil: new Date("2028-12-31"),
    }
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
