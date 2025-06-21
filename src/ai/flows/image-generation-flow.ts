
'use server';
/**
 * @fileOverview Generates an image of an ice cream flavor using AI.
 *
 * - generateIceCreamImage - A function that generates an image based on a prompt.
 * - ImageGenerationInput - The input type for the generateIceCreamImage function.
 * - ImageGenerationOutput - The return type for the generateIceCreamImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageGenerationInputSchema = z.object({
  prompt: z.string().describe('A detailed prompt to generate the ice cream image.'),
});
export type ImageGenerationInput = z.infer<typeof ImageGenerationInputSchema>;

const ImageGenerationOutputSchema = z.object({
  imageDataUri: z.string().nullable().describe('The generated image as a data URI (e.g., data:image/png;base64,...), or null if generation failed.'),
});
export type ImageGenerationOutput = z.infer<typeof ImageGenerationOutputSchema>;

export async function generateIceCreamImage(input: ImageGenerationInput): Promise<ImageGenerationOutput> {
  return generateIceCreamImageFlow(input);
}

const generateIceCreamImageFlow = ai.defineFlow(
  {
    name: 'generateIceCreamImageFlow',
    inputSchema: ImageGenerationInputSchema,
    outputSchema: ImageGenerationOutputSchema,
  },
  async (input) => {
    try {
      const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation', // Corrected model name for image generation
        prompt: input.prompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'], // Important: Must include TEXT and IMAGE
        },
      });

      if (media?.url) {
        return { imageDataUri: media.url };
      } else {
        console.error('Image generation did not return a media URL.');
        return { imageDataUri: null };
      }
    } catch (error) {
      console.error('Error generating image with Genkit:', error);
      return { imageDataUri: null };
    }
  }
);
