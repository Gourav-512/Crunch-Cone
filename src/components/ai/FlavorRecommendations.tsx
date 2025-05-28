"use client";

import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { getFlavorRecommendations, FlavorRecommendationsInput, FlavorRecommendationsOutput } from '@/ai/flows/flavor-recommendations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function FlavorRecommendations() {
  const { cartItems } = useCart();
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cartItems.length > 0) {
      const fetchRecommendations = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const input: FlavorRecommendationsInput = {
            cartItems: cartItems.map(item => item.name),
          };
          const result: FlavorRecommendationsOutput = await getFlavorRecommendations(input);
          setRecommendations(result.recommendations);
        } catch (e) {
          console.error("Failed to fetch recommendations:", e);
          setError("Could not fetch recommendations at this time.");
          setRecommendations([]); // Clear previous recommendations on error
        } finally {
          setIsLoading(false);
        }
      };
      fetchRecommendations();
    } else {
      setRecommendations([]); // Clear recommendations if cart is empty
    }
  }, [cartItems]);

  if (cartItems.length === 0 && !isLoading) {
    return null; // Don't show if cart is empty and not loading
  }

  return (
    <Card className="mt-8 shadow-md bg-card">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Lightbulb className="h-6 w-6 mr-2 text-accent-foreground" />
          You Might Also Like...
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        )}
        {error && <p className="text-destructive">{error}</p>}
        {!isLoading && !error && recommendations.length > 0 && (
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            {recommendations.map((rec, index) => (
              <li key={index} className="text-sm">{rec}</li>
            ))}
          </ul>
        )}
        {!isLoading && !error && recommendations.length === 0 && cartItems.length > 0 && (
          <p className="text-sm text-muted-foreground">Add more items to get recommendations!</p>
        )}
      </CardContent>
    </Card>
  );
}
