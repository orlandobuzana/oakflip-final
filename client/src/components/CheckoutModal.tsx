import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { Loader2, CreditCard, MapPin, User } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const shipping = 9.99;
  const tax = cartTotal * 0.08; // 8% tax
  const total = cartTotal + shipping + tax;

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      await apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: () => {
      clearCart();
      onClose();
      toast({
        title: "Order placed successfully!",
        description: "You will receive a confirmation email shortly.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to place order",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    const formData = new FormData(e.currentTarget);
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const orderData = {
      order: {
        customerName: `${formData.get("firstName")} ${formData.get("lastName")}`,
        customerEmail: formData.get("email") as string,
        customerAddress: formData.get("address") as string,
        customerCity: formData.get("city") as string,
        customerZip: formData.get("zipCode") as string,
        subtotal: cartTotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
      },
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    createOrderMutation.mutate(orderData);
    setIsProcessing(false);
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Checkout</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Billing Information */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <User className="w-5 h-5 mr-2" />
                <h3 className="text-lg font-semibold">Billing Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" required />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" required />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" required />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" required />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input id="zipCode" name="zipCode" required />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="w-5 h-5 mr-2" />
                <h3 className="text-lg font-semibold">Payment Information</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              
              {/* Cart Items */}
              <div className="space-y-2 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>{formatPrice(parseFloat(item.price) * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isProcessing || createOrderMutation.isPending}
              className="min-w-[140px]"
            >
              {isProcessing || createOrderMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${formatPrice(total)}`
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
