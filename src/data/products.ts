export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  amazonUrl: string;
  razorpayButtonId?: string;
  image: string;
  description: string;
  features: string[];
}

export const products: Product[] = [
  {
    id: "magnetic-fridge-planner",
    name: "Acrylic Magnetic Weekly Planner",
    category: "Magnets",
    price: 499,
    amazonUrl: "https://www.amazon.in/dp/EXAMPLE123",
    razorpayButtonId: "pl_EXAMPLE_BUTTON_ID",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600",
    description: "Premium high-clarity magnetic dry-erase planner for fridge organization.",
    features: ["Heavy-duty N52 magnets", "Scratch-resistant acrylic", "Includes 4 dry-erase markers"]
  },
  {
    id: "healing-crystal-set",
    name: "Raw Healing Crystals Desk Set",
    category: "Crystals",
    price: 799,
    amazonUrl: "https://www.amazon.in/dp/EXAMPLE456",
    razorpayButtonId: "",
    image: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=600",
    description: "Hand-picked natural display crystals with wooden stand.",
    features: ["100% natural unpolished stones", "Includes Amethyst, Quartz & Citrine", "Velvet pouch included"]
  }
];
