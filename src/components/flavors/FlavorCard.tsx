
"use client";

import Image from 'next/image';
import type { IceCreamFlavor } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star, PlusCircle, Zap, Loader2 } from 'lucide-react';
import FavoriteButton from '@/components/ui/FavoriteButton';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { generateIceCreamImage } from '@/ai/flows/image-generation-flow';
import { useToast } from '@/hooks/use-toast';

interface FlavorCardProps {
  flavor: IceCreamFlavor;
}

export default function FlavorCard({ flavor }: FlavorCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [aiGeneratedImageUrl, setAiGeneratedImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(flavor);
  };

  const handleGenerateAiImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGeneratingImage(true);
    const prompt = `A delicious, photorealistic image of ${flavor.name} ice cream. High quality, studio lighting. ${flavor.description}`;
    try {
      const result = await generateIceCreamImage({ prompt });
      if (result.imageDataUri) {
        setAiGeneratedImageUrl(result.imageDataUri);
        toast({
          title: "Image Generated!",
          description: `AI image for ${flavor.name} is ready.`,
        });
      } else {
        toast({
          title: "Image Generation Failed",
          description: "Could not generate an AI image at this time.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to generate AI image:", error);
      toast({
        title: "Image Generation Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const currentImageSrc = aiGeneratedImageUrl || flavor.image;

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg bg-card">
      <CardHeader className="p-0 relative">
        <Image
          src={currentImageSrc}
          alt={flavor.name}
          width={600}
          height={400}
          className="w-full h-48 object-cover"
          data-ai-hint={flavor.aiPromptHint}
          unoptimized={aiGeneratedImageUrl ? true : false}
        />
        <div className="absolute top-2 right-2">
          <FavoriteButton flavorId={flavor.id} className="bg-background/70 hover:bg-background/90" />
        </div>
        {!aiGeneratedImageUrl && (
          <div className="absolute bottom-2 left-2">
            <Button 
              size="sm" 
              onClick={handleGenerateAiImage} 
              disabled={isGeneratingImage}
              variant="secondary"
              className="bg-background/80 hover:bg-background/95 text-secondary-foreground backdrop-blur-sm"
            >
              {isGeneratingImage ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Zap className="mr-2 h-4 w-4" />
              )}
              {isGeneratingImage ? "Creating..." : "AI Image"}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-semibold mb-1">{flavor.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-2 h-10 overflow-hidden">
          {flavor.description}
        </CardDescription>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium text-primary">₹{flavor.price.toFixed(2)}</span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
            <span>{flavor.rating.toFixed(1)}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Category: {flavor.category}</p>
        {flavor.stock <= 0 && <p className="text-xs text-destructive mt-1">Out of stock</p>}
        {flavor.stock > 0 && flavor.stock < 20 && <p className="text-xs text-yellow-600 mt-1">Low stock ({flavor.stock} left)</p>}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart} 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          disabled={flavor.stock <= 0}
          aria-label={`Add ${flavor.name} to cart`}
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          {flavor.stock <=0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
