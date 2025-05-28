"use client";

import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import CartItemCard from "./CartItemCard";
import { ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { cartItems, getCartTotal, getCartItemCount } = useCart();
  const subtotal = getCartTotal();
  const deliveryFee = 0; // Placeholder
  const total = subtotal + deliveryFee;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg bg-background">
        <SheetHeader className="p-6">
          <SheetTitle className="text-2xl font-semibold">Your Cart ({getCartItemCount()})</SheetTitle>
        </SheetHeader>
        <Separator />
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-grow p-6 text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">Your cart is empty.</p>
            <p className="text-sm text-muted-foreground mb-4">Looks like you haven't added anything to your cart yet.</p>
            <SheetClose asChild>
              <Button variant="outline">Continue Shopping</Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-grow p-6">
              <div className="space-y-2">
                {cartItems.map(item => (
                  <CartItemCard key={item.flavorId} item={item} />
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <SheetFooter className="p-6 bg-background border-t">
              <div className="w-full space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : "Calculated at checkout"}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <SheetClose asChild>
                  <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mt-4">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
