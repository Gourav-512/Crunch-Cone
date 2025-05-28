export interface IceCreamFlavor {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number; // Average rating, e.g., 4.5
  stock: number;
}

export interface CartItem {
  flavorId: string;
  quantity: number;
  name: string; // Added for convenience in cart display and AI recommendations
  price: number; // Added for convenience
  image: string; // Added for convenience
}
