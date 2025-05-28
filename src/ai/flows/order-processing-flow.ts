
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

// The owner's phone number - IMPORTANT: Store this in an environment variable in a real app for flexibility.
// For example, process.env.OWNER_PHONE_NUMBER
const OWNER_PHONE_NUMBER = '8767154800'; // Use +91 prefix for real Indian numbers with SMS APIs that require it.

// SMS Sending Function
async function sendSmsNotification(phoneNumber: string, message: string): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

  // Check if Twilio credentials are configured in environment variables
  if (accountSid && authToken && twilioPhoneNumber) {
    try {
      const client = twilio(accountSid, authToken);
      await client.messages.create({
        body: message,
        from: twilioPhoneNumber, // Your Twilio phone number
        to: phoneNumber, // The recipient's phone number (owner's number)
      });
      console.log(`SMS sent successfully via Twilio to ${phoneNumber}.`);
      return true;
    } catch (error) {
      console.error('Error sending SMS via Twilio:', error);
      // Fallback to console log if Twilio fails
      console.log(`FALLBACK SIMULATED SMS to ${phoneNumber} (Twilio send failed): ${message}`);
      return false; // Indicate failure
    }
  } else {
    // Fallback to console log if Twilio is not configured
    console.warn(
      'Twilio credentials not found in environment variables. SMS not sent. Simulating instead.'
    );
    console.log(`SIMULATED SMS to ${phoneNumber}: ${message}`);
    return true; // Simulate success for console logging
  }
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

    // 3. Send the SMS notification to the owner
    const notificationSent = await sendSmsNotification(OWNER_PHONE_NUMBER, notificationMessage);

    // 4. Log the order (in a real app, this would be saved to a database)
    console.log(`Order ${orderId} processed. Details:`, JSON.stringify(input, null, 2));
    if (notificationSent && process.env.TWILIO_ACCOUNT_SID) { // Check if it was a real attempt
      console.log(`Owner notification SMS sent successfully to ${OWNER_PHONE_NUMBER}.`);
    } else if (notificationSent) {
      console.log(`Owner notification SMS simulated successfully to ${OWNER_PHONE_NUMBER}.`);
    } else {
      console.warn(`Owner notification SMS FAILED for ${OWNER_PHONE_NUMBER}. Check SMS service/logic or Twilio error logs.`);
    }
    
    // 5. Return a response to the frontend
    if (!notificationSent && process.env.TWILIO_ACCOUNT_SID) { // If real SMS attempt failed
      return {
        orderId,
        message: `Order placed (ID: ${orderId}), but there was an issue notifying the owner. We will still process your order.`,
        notificationSent: false,
      };
    }

    return {
      orderId,
      message: `Order ID: ${orderId}. Your order has been placed successfully! The shop owner has been notified.`,
      notificationSent: true, // True for simulation if Twilio isn't configured, or if Twilio succeeded.
    };
  }
);
