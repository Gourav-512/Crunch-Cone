export interface IceCreamFlavor {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string; // Placeholder URL or AI generated Data URI
  category: string;
  rating: number; // Average rating, e.g., 4.5
  stock: number;
  aiPromptHint: string; // Hint for Unsplash or generic image search
}

export interface CartItem {
  flavorId: string;
  quantity: number;
  name: string; // Added for convenience in cart display and AI recommendations
  price: number; // Added for convenience
  image: string; // Added for convenience, will be placeholder URL
  aiPromptHint?: string; // For Unsplash hints in cart if needed
}
