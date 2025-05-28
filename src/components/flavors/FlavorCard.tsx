"use client";

import Image from 'next/image';
import type { IceCreamFlavor } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star, PlusCircle } from 'lucide-react';
import FavoriteButton from '@/components/ui/FavoriteButton';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

interface FlavorCardProps {
  flavor: IceCreamFlavor;
}

export default function FlavorCard({ flavor }: FlavorCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(flavor);
  };
  
  // Extract data-ai-hint from flavor.image URL
  let imageUrl = flavor.image;
  let aiHint = "";
  try {
    const url = new URL(flavor.image);
    aiHint = url.searchParams.get("data-ai-hint") || "";
    imageUrl = `${url.protocol}//${url.host}${url.pathname}`;
  } catch (e) {
    // Invalid URL, use as is
  }


  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg bg-card">
      <CardHeader className="p-0 relative">
        <Image
          src={imageUrl}
          alt={flavor.name}
          width={600}
          height={400}
          className="w-full h-48 object-cover"
          data-ai-hint={aiHint || flavor.category.toLowerCase()}
        />
        <div className="absolute top-2 right-2">
          <FavoriteButton flavorId={flavor.id} className="bg-background/70 hover:bg-background/90" />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-semibold mb-1">{flavor.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-2 h-10 overflow-hidden">
          {flavor.description}
        </CardDescription>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium text-primary">${flavor.price.toFixed(2)}</span>
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
