
import { z } from 'zod';

// Define Schemas mirroring CartItem and for order details
export const CartItemSchemaForOrder = z.object({
  flavorId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  image: z.string().describe("Image URL of the item"),
  aiPromptHint: z.string().optional().describe("AI prompt hint for the item image"),
});

export const DeliveryAddressSchema = z.object({
  street: z.string().min(1, { message: "Street address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  zip: z.string().min(1, { message: "Zip code is required" }),
});

export const OrderInputSchema = z.object({
  cartItems: z.array(CartItemSchemaForOrder),
  totalAmount: z.number(),
  deliveryAddress: DeliveryAddressSchema,
  // Optional: customerContact: z.string().email().optional().describe("Customer's email for receipt"),
});
export type OrderInput = z.infer<typeof OrderInputSchema>;

export const OrderOutputSchema = z.object({
  orderId: z.string().nullable(),
  message: z.string(),
  notificationSent: z.boolean(),
});
export type OrderOutput = z.infer<typeof OrderOutputSchema>;
