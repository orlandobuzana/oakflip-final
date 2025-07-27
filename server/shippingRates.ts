// Shipping rate calculation logic
export interface ShippingZone {
  name: string;
  states: string[];
  baseRate: number;
  perItemRate: number;
  freeShippingThreshold: number;
}

export interface ShippingRate {
  method: string;
  cost: number;
  estimatedDays: string;
  description: string;
}

// Shipping zones configuration
export const SHIPPING_ZONES: ShippingZone[] = [
  {
    name: "Local",
    states: ["CA", "NV", "OR", "WA"],
    baseRate: 5.99,
    perItemRate: 1.50,
    freeShippingThreshold: 75.00
  },
  {
    name: "Regional",
    states: ["AZ", "CO", "ID", "MT", "NM", "UT", "WY"],
    baseRate: 8.99,
    perItemRate: 2.00,
    freeShippingThreshold: 100.00
  },
  {
    name: "National",
    states: ["AL", "AR", "CT", "DE", "FL", "GA", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "NE", "NH", "NJ", "NY", "NC", "ND", "OH", "OK", "PA", "RI", "SC", "SD", "TN", "TX", "VT", "VA", "WV", "WI"],
    baseRate: 12.99,
    perItemRate: 2.50,
    freeShippingThreshold: 125.00
  },
  {
    name: "Remote",
    states: ["AK", "HI"],
    baseRate: 19.99,
    perItemRate: 4.00,
    freeShippingThreshold: 200.00
  }
];

export function calculateShippingRates(
  state: string,
  subtotal: number,
  itemCount: number
): ShippingRate[] {
  const zone = SHIPPING_ZONES.find(z => z.states.includes(state));
  
  if (!zone) {
    // Default to national rates for unknown states
    const defaultZone = SHIPPING_ZONES.find(z => z.name === "National")!;
    return calculateRatesForZone(defaultZone, subtotal, itemCount);
  }
  
  return calculateRatesForZone(zone, subtotal, itemCount);
}

function calculateRatesForZone(
  zone: ShippingZone, 
  subtotal: number, 
  itemCount: number
): ShippingRate[] {
  const rates: ShippingRate[] = [];
  
  // Check if eligible for free shipping
  if (subtotal >= zone.freeShippingThreshold) {
    rates.push({
      method: "free_shipping",
      cost: 0,
      estimatedDays: "5-7",
      description: `Free Standard Shipping (orders over $${zone.freeShippingThreshold})`
    });
  }
  
  // Standard shipping
  const standardCost = zone.baseRate + (zone.perItemRate * itemCount);
  rates.push({
    method: "standard",
    cost: Math.round(standardCost * 100) / 100,
    estimatedDays: "5-7",
    description: "Standard Shipping"
  });
  
  // Express shipping (2x standard rate)
  const expressCost = standardCost * 2;
  rates.push({
    method: "express",
    cost: Math.round(expressCost * 100) / 100,
    estimatedDays: "2-3",
    description: "Express Shipping"
  });
  
  // Overnight shipping (3x standard rate)
  const overnightCost = standardCost * 3;
  rates.push({
    method: "overnight",
    cost: Math.round(overnightCost * 100) / 100,
    estimatedDays: "1",
    description: "Overnight Shipping"
  });
  
  return rates;
}

export function calculateTax(subtotal: number, state: string): number {
  // State tax rates (simplified - real implementation would use tax APIs)
  const taxRates: Record<string, number> = {
    "CA": 0.0725,  // 7.25%
    "NY": 0.08,    // 8%
    "TX": 0.0625,  // 6.25%
    "FL": 0.06,    // 6%
    "WA": 0.065,   // 6.5%
    "OR": 0,       // 0% (no sales tax)
    "NH": 0,       // 0% (no sales tax)
    "MT": 0,       // 0% (no sales tax)
    "DE": 0,       // 0% (no sales tax)
    "AK": 0,       // 0% (no state sales tax)
  };
  
  const rate = taxRates[state] || 0.07; // Default 7% for unknown states
  return Math.round(subtotal * rate * 100) / 100;
}