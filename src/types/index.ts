export interface IceCreamFlavor {
  id: string;
  name: string;
  description: string;
  price: number; // Will represent INR
  image: string; // Placeholder URL or AI generated Data URI
  category: string;
  rating: number; // Average rating, e.g., 4.5
  stock: number;
  aiPromptHint: string; // Hint for Unsplash or generic image search
}

export interface CartItem {
  flavorId: string;
  quantity: number;
  name: string; 
  price: number; // Will represent INR
  image: string; 
  aiPromptHint?: string;
}
