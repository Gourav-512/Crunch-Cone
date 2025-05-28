
'use server';
/**
 * @fileOverview Processes customer orders and sends notifications to the owner.
 *
 * - processOrder - Handles the order submission and owner notification.
 * - OrderInput - The input type for the processOrder function (imported from @/types/order).
 * - OrderOutput - The return type for the processOrder function (imported from @/types/order).
 */

import {ai} from '@/ai/genkit';
import { 
  OrderInputSchema, 
  type OrderInput, 
  OrderOutputSchema, 
  type OrderOutput 
} from '@/types/order';


// The owner's phone number - IMPORTANT: Move to an environment variable in a real app!
const OWNER_PHONE_NUMBER = '8767154800'; // Use +91 prefix for real Indian numbers with SMS APIs

// Mock SMS Sending Function (replace with actual SMS service integration)
async function sendSmsNotification(phoneNumber: string, message: string): Promise<boolean> {
  console.log(`SIMULATED SMS to ${phoneNumber}: ${message}`);
  // In a real app, integrate with Twilio, Vonage, Firebase SMS extension, etc.
  // Example (conceptual):
  // const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  // try {
  //   await twilio.messages.create({ body: message, from: process.env.TWILIO_PHONE_NUMBER, to: phoneNumber });
  //   console.log('SMS sent successfully via real service.');
  //   return true;
  // } catch (error) {
  //   console.error("Actual SMS sending failed:", error);
  //   return false;
  // }
  return true; // Simulate success for now
}

export async function processOrder(input: OrderInput): Promise<OrderOutput> {
  // Directly call the flow. The flow itself is the main logic.
  return processOrderFlow(input);
}

const processOrderFlow = ai.defineFlow(
  {
    name: 'processOrderFlow',
    inputSchema: OrderInputSchema,
    outputSchema: OrderOutputSchema,
  },
  async (input) => {
    // 1. Generate a unique order ID (simple timestamp-based for now)
    const orderId = `SCOOP-${Date.now()}`;

    // 2. Construct the notification message for the owner
    let itemsSummary = input.cartItems
      .map(item => `${item.name} (x${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}`)
      .join('\n  ');
    
    const notificationMessage = `
New Scoop Shop Order!
----------------------
Order ID: ${orderId}
Items:
  ${itemsSummary}
Total: ₹${input.totalAmount.toFixed(2)}
Delivery Address:
  ${input.deliveryAddress.street},
  ${input.deliveryAddress.city}, ${input.deliveryAddress.zip}
----------------------
    `.trim();

    // 3. "Send" the SMS notification to the owner
    // In a real app, ensure OWNER_PHONE_NUMBER includes country code if required by SMS provider e.g. +918767154800
    const notificationSent = await sendSmsNotification(OWNER_PHONE_NUMBER, notificationMessage);

    // 4. Log the order (in a real app, this would be saved to a database)
    console.log(`Order ${orderId} processed successfully. Details:`, JSON.stringify(input, null, 2));
    if (notificationSent) {
      console.log(`Owner notification SMS simulated successfully to ${OWNER_PHONE_NUMBER}.`);
    } else {
      console.warn(`Owner notification SMS simulation FAILED for ${OWNER_PHONE_NUMBER}. Check SMS service/logic.`);
      // Potentially trigger a fallback notification or alert for admin
    }
    
    // 5. Return a response to the frontend
    if (!notificationSent) {
      return {
        orderId, // Still provide orderId even if notification fails, as order is "placed"
        message: `Order placed (ID: ${orderId}), but there was an issue notifying the owner. We will still process your order.`,
        notificationSent: false,
      };
    }

    return {
      orderId,
      message: `Order ID: ${orderId}. Your order has been placed successfully! The shop owner has been notified.`,
      notificationSent: true,
    };
  }
);
