import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useState } from "react";
import CheckoutModal from "./CheckoutModal";

export default function ShoppingCart() {
  const { 
    cartItems, 
    isCartOpen, 
    closeCart, 
    updateQuantity, 
    removeFromCart, 
    cartTotal 
  } = useCart();
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleCheckout = () => {
    closeCart();
    setIsCheckoutOpen(true);
  };

  const formatPrice = (price: string | number) => {
    return `$${parseFloat(price.toString()).toFixed(2)}`;
  };

  const shipping = 9.99;
  const tax = cartTotal * 0.08; // 8% tax
  const total = cartTotal + shipping + tax;

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={closeCart}>
        <div 
          className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2" />
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              {cartItems.length > 0 && (
                <Badge className="ml-2">{cartItems.length}</Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={closeCart}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg mb-2">Your cart is empty</p>
                <p className="text-slate-400 text-sm mb-4">
                  Add some products to get started
                </p>
                <Button onClick={closeCart}>Continue Shopping</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-slate-100 last:border-b-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-slate-600 text-sm">
                        {formatPrice(item.price)}
                      </p>
                      <div className="flex items-center mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="mx-3 text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">
                        {formatPrice(parseFloat(item.price) * item.quantity)}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 h-8 w-8 p-0 mt-1"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-slate-200 p-6">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping:</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center font-semibold">
                  <span>Total:</span>
                  <span className="text-xl text-primary">{formatPrice(total)}</span>
                </div>
              </div>
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
      </div>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </>
  );
}
