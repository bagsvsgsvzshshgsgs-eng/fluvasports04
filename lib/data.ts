export interface Product {
  id: string;
  name: string;
  price: number;
  priceStr: string;
  image: string;
  colors: string[];
  colorNames: string[];
  sizes?: string[];
  isNew: boolean;
  category: string;
  categoryId?: string;
  subcategoryId?: string;
  displayLocations?: string[];
  badges?: string[];
  description: string;
  images: string[];
}

export const allProducts: Product[] = [
  {
    id: "prod_7",
    name: "Fluva Aurora Liquid Kneeskin",
    price: 650,
    priceStr: "EGP 650 - 700",
    image: "/images/aurora_kneeskin_2.jpg",
    images: [
      "/images/aurora_kneeskin_2.jpg",
      "/images/aurora_kneeskin_1.jpg",
      "/images/aurora_kneeskin_4.jpg",
      "/images/aurora_kneeskin_3.jpg"
    ],
    colors: ["bg-purple-600"],
    colorNames: ["Cosmic Purple"],
    sizes: ["8", "10", "12", "14", "16", "18"],
    isNew: true,
    category: "One Pieces",
    description: "The Fluva Aurora Liquid Kneeskin combines high-performance design with a mesmerizing swirl of purple, green, and pink colors. Features knee-length coverage for optimal hydrodynamics during competitive races and intense training.",
  },
  {
    id: "prod_1",
    name: "Fluva Blue Liquid Swimsuit",
    price: 650,
    priceStr: "EGP 650 - 700",
    image: "/images/blue_liquid_4.jpg",
    images: [
      "/images/blue_liquid_4.jpg",
      "/images/blue_liquid_1.jpg",
      "/images/blue_liquid_2.jpg",
      "/images/blue_liquid_3.jpg"
    ],
    colors: ["bg-blue-600"],
    colorNames: ["Liquid Blue"],
    sizes: ["8", "10", "12", "14", "16", "18"],
    isNew: true,
    category: "One Pieces",
    description: "The Fluva Blue Liquid Swimsuit features a dynamic, water-inspired print. Designed for both performance and style, it offers excellent support and freedom of movement.",
  },

  {
    id: "prod_3",
    name: "Fluva Sunset Pink Swimsuit",
    price: 650,
    priceStr: "EGP 650 - 700",
    image: "/images/suit_1.jpg",
    images: [
      "/images/suit_1.jpg",
      "/images/suit_11.jpg",
      "/images/suit_13.jpg",
      "/images/suit_14.jpg"
    ],
    colors: ["bg-pink-500"],
    colorNames: ["Sunset Pink"],
    sizes: ["8", "10", "12", "14", "16", "18"],
    isNew: true,
    category: "One Pieces",
    description: "The Fluva Sunset Pink Swimsuit brings a vibrant pop of color. Ideal for training or casual swimming, offering great comfort and durability.",
  },
  {
    id: "prod_4",
    name: "Fluva Geo Block Swimsuit",
    price: 650,
    priceStr: "EGP 650 - 700",
    image: "/images/geo_suit_1.jpg",
    images: [
      "/images/geo_suit_1.jpg",
      "/images/geo_suit_2.jpg",
      "/images/geo_suit_3.jpg",
      "/images/geo_suit_4.jpg"
    ],
    colors: ["bg-teal-500"],
    colorNames: ["Aqua Block"],
    sizes: ["8", "10", "12", "14", "16", "18"],
    isNew: true,
    category: "One Pieces",
    description: "The Fluva Geo Block Swimsuit features a striking geometric pattern in vibrant aqua and orange. A perfect balance of athletic performance and modern design.",
  },
  {
    id: "prod_5",
    name: "Fluva Aurora Liquid Swimsuit",
    price: 650,
    priceStr: "EGP 650 - 700",
    image: "/images/aurora_suit_2.jpg",
    images: [
      "/images/aurora_suit_2.jpg",
      "/images/aurora_suit_1.jpg",
      "/images/aurora_suit_3.jpg",
      "/images/aurora_suit_4.jpg"
    ],
    colors: ["bg-purple-600"],
    colorNames: ["Cosmic Purple"],
    sizes: ["8", "10", "12", "14", "16", "18"],
    isNew: true,
    category: "One Pieces",
    description: "The Fluva Aurora Liquid Swimsuit showcases a mesmerizing swirl of purple, green, and pink colors. Designed for maximum comfort and a standout look in the water.",
  },
  {
    id: "prod_6",
    name: "Fluva Orange Camo Kneeskin",
    price: 650,
    priceStr: "EGP 650 - 700",
    image: "/images/kneeskin_camo_1.jpg",
    images: [
      "/images/kneeskin_camo_1.jpg",
      "/images/kneeskin_camo_2.jpg",
      "/images/kneeskin_camo_3.jpg",
      "/images/kneeskin_camo_4.jpg"
    ],
    colors: ["bg-orange-600"],
    colorNames: ["Orange Camo"],
    sizes: ["8", "10", "12", "14", "16", "18"],
    isNew: true,
    category: "One Pieces",
    description: "The Fluva Orange Camo Kneeskin is built for competitive performance. Featuring a bold orange and grey camouflage print with knee-length coverage for maximum hydrodynamics and muscle support.",
  }
];

export function getProductById(id: string): Product | undefined {
  return allProducts.find((p) => p.id === id);
}
