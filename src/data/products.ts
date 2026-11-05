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
  chakra: string;
  element: string;
  origin: string;
}

export const products: Product[] = [
  {
    id: "raw-amethyst-cluster",
    name: "Raw Amethyst Cluster",
    category: "Crystals",
    price: 699,
    amazonUrl: "https://www.amazon.in/dp/B08N5K9XYZ",
    razorpayButtonId: "pl_AmethystBtn699",
    image: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=600",
    description: "Deep purple Brazilian amethyst cluster known for its powerful spiritual protection and high vibrational frequency. Perfect for meditation spaces and cleansing other crystals.",
    features: [
      "100% natural, ethically sourced Brazilian crystal",
      "Rich deep violet points with natural basalt matrix",
      "Naturally purifies ambient energy",
      "Hand-inspected for crystal clarity"
    ],
    chakra: "Third Eye & Crown",
    element: "Wind",
    origin: "Minas Gerais, Brazil"
  },
  {
    id: "rose-quartz-tower",
    name: "Natural Rose Quartz Tower",
    category: "Crystals",
    price: 549,
    amazonUrl: "https://www.amazon.in/dp/B08N5K8ABC",
    razorpayButtonId: "pl_RoseQuartzBtn549",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600",
    description: "Exquisitely polished obelisk generator carved from pure pink rose quartz. Directs loving energy outwards and fosters deep emotional healing and self-love.",
    features: [
      "Hand-carved and polished 6-facet generator tower",
      "Soft translucent pink hue with natural inclusions",
      "Amplifies compassionate intentions",
      "Stands stable on a flat polished base"
    ],
    chakra: "Heart",
    element: "Water",
    origin: "Madagascar"
  },
  {
    id: "clear-quartz-point",
    name: "Clear Quartz Master Crystal",
    category: "Crystals",
    price: 499,
    amazonUrl: "https://www.amazon.in/dp/B08N5K7DEF",
    razorpayButtonId: "pl_ClearQuartzBtn499",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600",
    description: "The 'Master Healer' of crystals. This natural laser quartz point absorbs, stores, releases, and regulates energy, making it essential for manifestation grids.",
    features: [
      "Optically clear terminated quartz crystal",
      "High energetic resonance and amplification",
      "Ideal for grid work and meditation focus",
      "Cleansed under full moonlight"
    ],
    chakra: "All Chakras",
    element: "Storm",
    origin: "Himalayas, India"
  },
  {
    id: "tibetan-singing-bowl",
    name: "Hand-Hammered Tibetan Singing Bowl Set",
    category: "Sound Healing",
    price: 1299,
    amazonUrl: "https://www.amazon.in/dp/B08N5K6GHI",
    razorpayButtonId: "pl_SingingBowlBtn1299",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=600",
    description: "Authentic hand-hammered brass singing bowl crafted by artisans in the Himalayas. Produces deeply soothing harmonic overtones for chakra balancing and sound baths.",
    features: [
      "Hand-hammered traditional 7-metal alloy bronze",
      "Includes wooden striker and hand-sewn silk cushion",
      "Rich, long-lasting resonant acoustic vibration",
      "Deeply calms nervous system during meditation"
    ],
    chakra: "Heart & Crown",
    element: "Ether",
    origin: "Himalayas, Nepal"
  }
];
