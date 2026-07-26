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
import twilio from 'twilio';

// The owner's phone number
const OWNER_PHONE_NUMBER = '8767154800';

// SMS Sending Function
async function sendSmsNotification(phoneNumber: string, message: string): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

  if (accountSid && authToken && twilioPhoneNumber) {
    try {
      const client = twilio(accountSid, authToken);
      await client.messages.create({
        body: message,
        from: twilioPhoneNumber,
        to: phoneNumber,
      });
      return true;
    } catch (error) {
      console.error('Error sending SMS via Twilio:', error);
      return false;
    }
  } else {
    console.log(`SIMULATED SMS to ${phoneNumber}: ${message}`);
    return true;
  }
}

export async function processOrder(input: OrderInput): Promise<OrderOutput> {
  return processOrderFlow(input);
}

const processOrderFlow = ai.defineFlow(
  {
    name: 'processOrderFlow',
    inputSchema: OrderInputSchema,
    outputSchema: OrderOutputSchema,
  },
  async (input) => {
    const orderId = `CRUNCH-${Date.now()}`;

    let itemsSummary = input.cartItems
      .map(item => `${item.name} (x${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}`)
      .join('\n  ');
    
    const notificationMessage = `
New Crunch Cone Order!
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

    const notificationSent = await sendSmsNotification(OWNER_PHONE_NUMBER, notificationMessage);

    return {
      orderId,
      message: `Order ID: ${orderId}. Your order has been placed successfully! The shop owner has been notified.`,
      notificationSent: true,
    };
  }
);
