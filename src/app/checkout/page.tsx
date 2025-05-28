"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/contexts/CartContext";
import { AlertCircle, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const subtotal = getCartTotal();
  const deliveryFee = 5.00; // Placeholder
  const total = subtotal + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">You need to add items to your cart before proceeding to checkout.</p>
        <Button asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }
  
  const handlePlaceOrder = () => {
    // Simulate order placement
    console.log("Order placed with items:", cartItems, "Total:", total);
    toast({
      title: "Order Placed!",
      description: "Thank you for your order. We're preparing it now!",
    });
    clearCart();
    router.push("/"); // Redirect to homepage after order
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.map(item => (
              <div key={item.flavorId} className="flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium">{item.name} <span className="text-muted-foreground">x {item.quantity}</span></p>
                </div>
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <hr />
            <div className="flex justify-between text-sm">
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-sm">
              <p>Delivery Fee (placeholder)</p>
              <p>${deliveryFee.toFixed(2)}</p>
            </div>
            <hr />
            <div className="flex justify-between font-semibold text-lg">
              <p>Total</p>
              <p>${total.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><MapPin className="mr-2 h-5 w-5" /> Delivery Address</CardTitle>
              <CardDescription>Enter your delivery details. Map integration coming soon!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" placeholder="123 Main St" />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Anytown" />
              </div>
              <div>
                <Label htmlFor="zip">Zip Code</Label>
                <Input id="zip" placeholder="12345" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Choose your preferred payment method.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup defaultValue="cod">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <RadioGroupItem value="online" id="online" disabled />
                  <Label htmlFor="online" className="text-muted-foreground">Online Payment Gateway (Coming Soon)</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
      </div>
      <CardFooter className="mt-8 flex justify-end p-0">
        <Button size="lg" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handlePlaceOrder}>
          Place Order
        </Button>
      </CardFooter>
    </div>
  );
}
