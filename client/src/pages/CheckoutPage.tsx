import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { ShoppingCart, CreditCard, Truck, Check } from "lucide-react";

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  paymentMethod: string;
  specialInstructions: string;
}

interface ShippingRate {
  method: string;
  cost: number;
  estimatedDays: string;
  description: string;
}

interface ShippingCalculation {
  shippingRates: ShippingRate[];
  tax: string;
  taxRate: string;
}

export default function CheckoutPage() {
  const { items, total: totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    paymentMethod: "credit_card",
    specialInstructions: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [availableDeals, setAvailableDeals] = useState<any[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<string>("");
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingRate | null>(null);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [finalAmount, setFinalAmount] = useState(totalAmount || 0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

  // Fetch available deals using useQuery
  const { data: allDeals } = useQuery({
    queryKey: ["/api/deals"],
    enabled: items && items.length > 0,
  });

  // Filter active deals
  useEffect(() => {
    if (allDeals && Array.isArray(allDeals)) {
      const activeDeals = allDeals.filter((deal: any) => 
        deal.isActive && 
        new Date(deal.startDate) <= new Date() && 
        new Date(deal.endDate) >= new Date() &&
        (totalAmount || 0) >= deal.minOrderAmount
      );
      setAvailableDeals(activeDeals);
    }
  }, [allDeals, totalAmount]);

  // Calculate shipping rates when state changes
  const calculateShipping = async (state: string) => {
    if (!state || !items || items.length === 0) return;
    
    setIsCalculatingShipping(true);
    try {
      const response = await apiRequest("POST", "/api/shipping/calculate", {
        state,
        subtotal: (totalAmount || 0).toString(),
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
      });
      
      setShippingRates(response.shippingRates);
      setTaxAmount(parseFloat(response.tax));
      
      // Auto-select cheapest shipping option
      if (response.shippingRates.length > 0) {
        const cheapest = response.shippingRates.reduce((prev: ShippingRate, curr: ShippingRate) => 
          prev.cost < curr.cost ? prev : curr
        );
        setSelectedShipping(cheapest);
      }
    } catch (error) {
      console.error("Failed to calculate shipping:", error);
      toast({
        title: "Shipping Calculation Error",
        description: "Unable to calculate shipping rates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  // Calculate shipping when state changes
  useEffect(() => {
    if (formData.state && formData.state.length === 2) {
      calculateShipping(formData.state);
    }
  }, [formData.state]);

  // Calculate final amount with deal, shipping, and tax
  useEffect(() => {
    let subtotal = totalAmount || 0;
    
    // Apply deal discount
    if (selectedDeal && availableDeals.length > 0) {
      const deal = availableDeals.find(d => d._id === selectedDeal);
      if (deal) {
        let discount = 0;
        if (deal.discountType === "percentage") {
          discount = ((totalAmount || 0) * deal.discountValue) / 100;
        } else {
          discount = deal.discountValue;
        }
        subtotal = Math.max(0, (totalAmount || 0) - discount);
      }
    }
    
    // Add shipping and tax
    const shippingCost = selectedShipping?.cost || 0;
    const total = subtotal + shippingCost + taxAmount;
    setFinalAmount(total);
  }, [selectedDeal, totalAmount, availableDeals, selectedShipping, taxAmount]);

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: (order) => {
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${order._id} has been placed and is being processed.`,
      });
      clearCart();
      setLocation(`/order-confirmation/${order._id}`);
    },
    onError: () => {
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.address || !formData.city || !formData.state || !formData.zipCode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required shipping address fields.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedShipping) {
      toast({
        title: "Shipping Required",
        description: "Please select a shipping method.",
        variant: "destructive",
      });
      return;
    }

    // Calculate subtotal after deal discount
    let subtotal = totalAmount || 0;
    if (selectedDeal && availableDeals.length > 0) {
      const deal = availableDeals.find(d => d._id === selectedDeal);
      if (deal) {
        let discount = 0;
        if (deal.discountType === "percentage") {
          discount = ((totalAmount || 0) * deal.discountValue) / 100;
        } else {
          discount = deal.discountValue;
        }
        subtotal = Math.max(0, (totalAmount || 0) - discount);
      }
    }

    const orderData = {
      order: {
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        customerCity: formData.city,
        customerState: formData.state,
        customerZip: formData.zipCode,
        customerCountry: formData.country,
        shippingMethod: selectedShipping?.method,
        specialInstructions: formData.specialInstructions,
        subtotal: subtotal.toFixed(2),
        shipping: (selectedShipping?.cost || 0).toFixed(2),
        tax: taxAmount.toFixed(2),
        total: finalAmount.toFixed(2),
        status: "pending"
      },
      items: items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    createOrderMutation.mutate(orderData);
  };

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-4">Add some items to your cart before checking out.</p>
            <Button onClick={() => setLocation("/products")}>
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 1, title: "Shipping", icon: Truck },
              { step: 2, title: "Payment", icon: CreditCard },
              { step: 3, title: "Review", icon: Check },
            ].map(({ step, title, icon: Icon }) => (
              <div
                key={step}
                className={`flex items-center space-x-2 ${
                  currentStep >= step ? "text-primary" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= step
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-medium">{title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Select 
                        value={formData.state} 
                        onValueChange={(value) => handleInputChange("state", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AL">Alabama</SelectItem>
                          <SelectItem value="AK">Alaska</SelectItem>
                          <SelectItem value="AZ">Arizona</SelectItem>
                          <SelectItem value="AR">Arkansas</SelectItem>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="CO">Colorado</SelectItem>
                          <SelectItem value="CT">Connecticut</SelectItem>
                          <SelectItem value="DE">Delaware</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                          <SelectItem value="GA">Georgia</SelectItem>
                          <SelectItem value="HI">Hawaii</SelectItem>
                          <SelectItem value="ID">Idaho</SelectItem>
                          <SelectItem value="IL">Illinois</SelectItem>
                          <SelectItem value="IN">Indiana</SelectItem>
                          <SelectItem value="IA">Iowa</SelectItem>
                          <SelectItem value="KS">Kansas</SelectItem>
                          <SelectItem value="KY">Kentucky</SelectItem>
                          <SelectItem value="LA">Louisiana</SelectItem>
                          <SelectItem value="ME">Maine</SelectItem>
                          <SelectItem value="MD">Maryland</SelectItem>
                          <SelectItem value="MA">Massachusetts</SelectItem>
                          <SelectItem value="MI">Michigan</SelectItem>
                          <SelectItem value="MN">Minnesota</SelectItem>
                          <SelectItem value="MS">Mississippi</SelectItem>
                          <SelectItem value="MO">Missouri</SelectItem>
                          <SelectItem value="MT">Montana</SelectItem>
                          <SelectItem value="NE">Nebraska</SelectItem>
                          <SelectItem value="NV">Nevada</SelectItem>
                          <SelectItem value="NH">New Hampshire</SelectItem>
                          <SelectItem value="NJ">New Jersey</SelectItem>
                          <SelectItem value="NM">New Mexico</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="NC">North Carolina</SelectItem>
                          <SelectItem value="ND">North Dakota</SelectItem>
                          <SelectItem value="OH">Ohio</SelectItem>
                          <SelectItem value="OK">Oklahoma</SelectItem>
                          <SelectItem value="OR">Oregon</SelectItem>
                          <SelectItem value="PA">Pennsylvania</SelectItem>
                          <SelectItem value="RI">Rhode Island</SelectItem>
                          <SelectItem value="SC">South Carolina</SelectItem>
                          <SelectItem value="SD">South Dakota</SelectItem>
                          <SelectItem value="TN">Tennessee</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="UT">Utah</SelectItem>
                          <SelectItem value="VT">Vermont</SelectItem>
                          <SelectItem value="VA">Virginia</SelectItem>
                          <SelectItem value="WA">Washington</SelectItem>
                          <SelectItem value="WV">West Virginia</SelectItem>
                          <SelectItem value="WI">Wisconsin</SelectItem>
                          <SelectItem value="WY">Wyoming</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => handleInputChange("country", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Shipping Options */}
                  {formData.state && (
                    <div className="mt-6">
                      <Label className="text-base font-semibold">Shipping Options</Label>
                      {isCalculatingShipping ? (
                        <div className="mt-2 p-4 border rounded-lg">
                          <div className="animate-pulse">Calculating shipping rates...</div>
                        </div>
                      ) : shippingRates.length > 0 ? (
                        <div className="mt-2 space-y-2">
                          {shippingRates.map((rate) => (
                            <div 
                              key={rate.method}
                              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                selectedShipping?.method === rate.method 
                                  ? 'border-primary bg-primary/5' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => setSelectedShipping(rate)}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-medium">{rate.description}</div>
                                  <div className="text-sm text-gray-600">{rate.estimatedDays} business days</div>
                                </div>
                                <div className="text-lg font-semibold">
                                  {rate.cost === 0 ? 'FREE' : `$${rate.cost.toFixed(2)}`}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : formData.state && (
                        <div className="mt-2 p-4 border rounded-lg text-gray-600">
                          No shipping rates available for selected state.
                        </div>
                      )}
                    </div>
                  )}

                  <Button
                    onClick={() => setCurrentStep(2)}
                    className="w-full"
                    disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.address || !formData.city || !formData.state || !formData.zipCode || !selectedShipping}
                  >
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment Information */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(value) => handleInputChange("paymentMethod", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="debit_card">Debit Card</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="cash_on_delivery">Cash on Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {availableDeals.length > 0 && (
                    <div>
                      <Label htmlFor="deal">Apply Deal (Optional)</Label>
                      <Select
                        value={selectedDeal}
                        onValueChange={setSelectedDeal}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a deal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No deal</SelectItem>
                          {availableDeals.map((deal) => (
                            <SelectItem key={deal._id} value={deal._id}>
                              {deal.title} - {deal.discountType === "percentage" ? `${deal.discountValue}%` : `$${deal.discountValue}`} off
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="specialInstructions">Special Instructions</Label>
                    <Textarea
                      id="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                      placeholder="Any special delivery instructions..."
                    />
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1"
                    >
                      Back to Shipping
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(3)}
                      className="flex-1"
                    >
                      Review Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Review Order */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Shipping Address</h4>
                    <p className="text-sm text-gray-600">
                      {formData.firstName} {formData.lastName}<br />
                      {formData.address}<br />
                      {formData.city}, {formData.state} {formData.zipCode}<br />
                      {formData.country}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Payment Method</h4>
                    <p className="text-sm text-gray-600 capitalize">
                      {formData.paymentMethod.replace("_", " ")}
                    </p>
                  </div>

                  {selectedDeal && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-2">Applied Deal</h4>
                        <p className="text-sm text-green-600">
                          {availableDeals.find(d => d._id === selectedDeal)?.title}
                        </p>
                      </div>
                    </>
                  )}

                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="flex-1"
                    >
                      Back to Payment
                    </Button>
                    <Button
                      onClick={handleSubmitOrder}
                      className="flex-1"
                      disabled={createOrderMutation.isPending}
                    >
                      {createOrderMutation.isPending ? "Placing Order..." : "Place Order"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item: any) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${(totalAmount || 0).toFixed(2)}</span>
                  </div>
                  
                  {selectedDeal && availableDeals.length > 0 && (() => {
                    const deal = availableDeals.find(d => d._id === selectedDeal);
                    if (deal) {
                      let discount = 0;
                      if (deal.discountType === "percentage") {
                        discount = ((totalAmount || 0) * deal.discountValue) / 100;
                      } else {
                        discount = deal.discountValue;
                      }
                      return (
                        <div className="flex justify-between text-green-600">
                          <span>Discount ({deal.discountType === "percentage" ? `${deal.discountValue}%` : `$${deal.discountValue}`})</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      );
                    }
                    return null;
                  })()}
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {selectedShipping ? (
                        selectedShipping.cost === 0 ? 'FREE' : `$${selectedShipping.cost.toFixed(2)}`
                      ) : (
                        'Calculate shipping'
                      )}
                    </span>
                  </div>
                  
                  {taxAmount > 0 && (
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${finalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}