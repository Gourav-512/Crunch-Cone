'use server';

/**
 * @fileOverview Recommends ice cream flavors based on the current cart.
 *
 * - getFlavorRecommendations - A function that returns flavor recommendations.
 * - FlavorRecommendationsInput - The input type for the getFlavorRecommendations function.
 * - FlavorRecommendationsOutput - The return type for the getFlavorRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FlavorRecommendationsInputSchema = z.object({
  cartItems: z
    .array(z.string())
    .describe('A list of ice cream flavors currently in the user cart.'),
});
export type FlavorRecommendationsInput = z.infer<
  typeof FlavorRecommendationsInputSchema
>;

const FlavorRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('A list of recommended ice cream flavors.'),
});
export type FlavorRecommendationsOutput = z.infer<
  typeof FlavorRecommendationsOutputSchema
>;

export async function getFlavorRecommendations(
  input: FlavorRecommendationsInput
): Promise<FlavorRecommendationsOutput> {
  return flavorRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'flavorRecommendationsPrompt',
  input: {schema: FlavorRecommendationsInputSchema},
  output: {schema: FlavorRecommendationsOutputSchema},
  prompt: `You are an ice cream flavor expert. Given the following list of ice cream flavors in the user's cart, recommend three additional flavors that would complement their current selection.

Cart Items: {{#each cartItems}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Consider flavor profiles, common pairings, and overall taste experience when making your recommendations. Return only a list of flavor names without any additional commentary.
`,
});

const flavorRecommendationsFlow = ai.defineFlow(
  {
    name: 'flavorRecommendationsFlow',
    inputSchema: FlavorRecommendationsInputSchema,
    outputSchema: FlavorRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
