import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const products = [
  {
    title: "Airline-Approved Pet Travel Carrier",
    description:
      "Soft-sided pet carrier approved for airline cabin use. Features mesh panels for ventilation, padded shoulder strap, and collapsible design for easy storage.",
    price: 54.99,
    rating: 4,
    images: [
      "https://images.unsplash.com/photo-1764813824215-4afa03d1a011?fit=max&w=1080",
      "https://images.unsplash.com/photo-1764813824215-4afa03d1a011?fit=max&w=1080",
      "https://images.unsplash.com/photo-1764813824215-4afa03d1a011?fit=max&w=1080",
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
      "https://images.unsplash.com/photo-1545249390-6bdfa286032f?fit=max&w=1080",
      "https://images.unsplash.com/photo-1545249390-6bdfa286032f?fit=max&w=1080",
      "https://images.unsplash.com/photo-1545249390-6bdfa286032f?fit=max&w=1080",
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
      "https://images.unsplash.com/photo-1758543535539-325abf59ef48?fit=max&w=1080",
      "https://images.unsplash.com/photo-1758543535539-325abf59ef48?fit=max&w=1080",
      "https://images.unsplash.com/photo-1758543535539-325abf59ef48?fit=max&w=1080",
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
      "https://images.unsplash.com/photo-1713106872096-cee971f0528e?fit=max&w=1080",
      "https://images.unsplash.com/photo-1713106872096-cee971f0528e?fit=max&w=1080",
      "https://images.unsplash.com/photo-1713106872096-cee971f0528e?fit=max&w=1080",
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
      "https://images.unsplash.com/photo-1598134493179-51332e56807f?fit=max&w=1080",
      "https://images.unsplash.com/photo-1598134493179-51332e56807f?fit=max&w=1080",
      "https://images.unsplash.com/photo-1598134493179-51332e56807f?fit=max&w=1080",
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
      "https://images.unsplash.com/photo-1577447278822-37801be21738?fit=max&w=1080",
      "https://images.unsplash.com/photo-1577447278822-37801be21738?fit=max&w=1080",
      "https://images.unsplash.com/photo-1577447278822-37801be21738?fit=max&w=1080",
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
