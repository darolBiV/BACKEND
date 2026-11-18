import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Product images are hosted in the public Supabase Storage bucket.
const STORAGE_BASE_URL =
  process.env.SEED_IMAGES_BASE_URL ??
  "https://iltlhvuocgebupanwzhg.supabase.co/storage/v1/object/public/product-images/products/seed";

const productImage = (fileName: string): string => `${STORAGE_BASE_URL}/${fileName}`;

const products = [
  {
    title: "Airline-Approved Pet Travel Carrier",
    description:
      "Soft-sided pet carrier approved for airline cabin use. Features mesh panels for ventilation, padded shoulder strap, and collapsible design for easy storage.",
    price: 54.99,
    rating: 4,
    images: [
      productImage("pet-travel-carrier-1.jpg"),
      productImage("pet-travel-carrier-2.jpg"),
      productImage("pet-travel-carrier-3.jpg"),
    ],
    stockQuantity: 20,
  },
  {
    title: "Multi-Level Cat Scratching Post",
    description:
      "Three-tier cat scratching post with sisal rope wrapping and plush platforms. Designed for climbing, scratching, and resting in one place.",
    price: 89.99,
    rating: 4.5,
    images: [
      productImage("cat-scratching-post-1.jpg"),
      productImage("cat-scratching-post-2.jpg"),
      productImage("cat-scratching-post-3.jpg"),
    ],
    stockQuantity: 20,
  },
  {
    title: "Interactive Rubber Chew Ball",
    description:
      "Durable rubber chew ball designed for energetic play and daily chewing. Helps keep dogs entertained and supports interactive activity.",
    price: 15.99,
    rating: 5,
    images: [
      productImage("rubber-chew-ball-1.jpg"),
      productImage("rubber-chew-ball-2.jpg"),
      productImage("rubber-chew-ball-3.jpg"),
    ],
    stockQuantity: 20,
  },
  {
    title: "Orthopedic Memory Foam Pet Bed",
    description:
      "Orthopedic pet bed with memory foam support for better rest and comfort. The soft cover feels cozy and supports joints during sleep.",
    price: 49.99,
    rating: 3.5,
    images: [
      productImage("memory-foam-pet-bed-1.jpg"),
      productImage("memory-foam-pet-bed-2.jpg"),
      productImage("memory-foam-pet-bed-3.jpg"),
    ],
    stockQuantity: 20,
  },
  {
    title: "Premium Stainless Steel Dog Bowl",
    description:
      "Durable stainless steel dog bowl designed for medium to large breeds. A non-slip base helps prevent spills during feeding.",
    price: 24.99,
    rating: 5,
    images: [
      productImage("stainless-steel-dog-bowl-1.jpg"),
      productImage("stainless-steel-dog-bowl-2.jpg"),
      productImage("stainless-steel-dog-bowl-3.jpg"),
    ],
    stockQuantity: 20,
  },
  {
    title: "Reflective Nylon Dog Leash & Collar Set",
    description:
      "Durable reflective leash and collar set for daily walks. Designed for visibility, comfort, and secure control in low-light conditions.",
    price: 29.99,
    rating: 4,
    images: [
      productImage("reflective-leash-collar-set-1.jpg"),
      productImage("reflective-leash-collar-set-2.jpg"),
      productImage("reflective-leash-collar-set-3.jpg"),
    ],
    stockQuantity: 20,
  },
] as const;

const seed = async (): Promise<void> => {
  const passwordHash = await bcrypt.hash("Password123!", 10);

  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.promoCode.deleteMany();
  await prisma.user.deleteMany();

  await prisma.product.createMany({ data: products });

  await prisma.promoCode.create({
    data: {
      code: "SAVE10",
      discountPercentage: 10,
      isActive: true,
    },
  });

  await prisma.user.createMany({
    data: [
      {
        email: "customer@example.com",
        passwordHash,
        role: Role.CUSTOMER,
      },
      {
        email: "admin@example.com",
        passwordHash,
        role: Role.ADMIN,
      },
    ],
  });
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
