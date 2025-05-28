"use client";

import Image from 'next/image';
import type { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MinusCircle, PlusCircle, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface CartItemCardProps {
  item: CartItem;
}

export default function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeFromCart } = useCart();

  // CartItem.image will be the placeholder URL from data.ts
  // CartItem.aiPromptHint can be used for the data-ai-hint attribute
  const aiHintForImage = item.aiPromptHint || item.name.split(' ')[0].toLowerCase() || "icecream";

  return (
    <div className="flex items-center space-x-4 py-3 border-b last:border-b-0">
      <Image
        src={item.image} // This is the placeholder image
        alt={item.name}
        width={64}
        height={64}
        className="w-16 h-16 object-cover rounded-md"
        data-ai-hint={aiHintForImage} // Use the hint from cart item
      />
      <div className="flex-grow">
        <h4 className="font-semibold text-sm">{item.name}</h4>
        <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.flavorId, item.quantity - 1)} disabled={item.quantity <= 1} aria-label="Decrease quantity">
          <MinusCircle className="h-5 w-5" />
        </Button>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (!isNaN(val)) updateQuantity(item.flavorId, val);
          }}
          className="w-12 h-8 text-center"
          min="1"
          // max={flavor.stock} // Ideally, we'd have stock info here from the original flavor
          aria-label="Quantity"
        />
        <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.flavorId, item.quantity + 1)} aria-label="Increase quantity">
          <PlusCircle className="h-5 w-5" />
        </Button>
      </div>
      <p className="font-semibold w-16 text-right">${(item.price * item.quantity).toFixed(2)}</p>
      <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.flavorId)} className="text-destructive hover:text-destructive/80" aria-label="Remove item">
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
}
