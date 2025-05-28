import { config } from 'dotenv';
config();

import '@/ai/flows/flavor-recommendations.ts';
import '@/ai/flows/image-generation-flow.ts';
import '@/ai/flows/order-processing-flow.ts'; // Added new order processing flow
