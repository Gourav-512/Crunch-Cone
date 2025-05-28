"use client";

import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  flavorId: string;
  className?: string;
}

export default function FavoriteButton({ flavorId, className }: FavoriteButtonProps) {
  const { toggleFavorite, isFavorite, isLoaded } = useFavorites();
  const favorited = isFavorite(flavorId);

  if (!isLoaded) {
    return (
      <Button variant="ghost" size="icon" className={cn("text-muted-foreground", className)} disabled>
        <Heart className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.stopPropagation(); // Prevent card click when clicking button
        toggleFavorite(flavorId);
      }}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        favorited ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-red-400",
        className
      )}
    >
      <Heart className={cn("h-5 w-5", favorited && "fill-current")} />
    </Button>
  );
}
