import { createContext, useContext, useState } from "react";

export type Currency = "INR" | "USD";
export type ShippingRegion = "india" | "international";

interface CurrencyContextValue {
  currency: Currency;
  shippingRegion: ShippingRegion;
  setCurrency: (c: Currency) => void;
  setShippingRegion: (r: ShippingRegion) => void;
  formatPrice: (
    priceINR?: number,
    priceUSD?: number,
    fallbackCents?: number,
  ) => string;
  getShipping: (
    shippingIndia?: number,
    shippingInternational?: number,
  ) => { amount: number; label: string } | null;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("INR");
  const [shippingRegion, setShippingRegion] = useState<ShippingRegion>("india");

  const formatPrice = (
    priceINR?: number,
    priceUSD?: number,
    fallbackCents = 0,
  ): string => {
    if (currency === "USD") {
      if (priceUSD !== undefined && priceUSD > 0) {
        return `$${(priceUSD / 100).toFixed(2)}`;
      }
      // fallback: rough conversion from INR cents
      const inr =
        priceINR !== undefined && priceINR > 0 ? priceINR : fallbackCents;
      return `$${(inr / 8300).toFixed(2)}`;
    }
    // INR
    if (priceINR !== undefined && priceINR > 0) {
      return `₹${(priceINR / 100).toFixed(2)}`;
    }
    return `₹${(fallbackCents / 100).toFixed(2)}`;
  };

  const getShipping = (
    shippingIndia?: number,
    shippingInternational?: number,
  ): { amount: number; label: string } | null => {
    if (shippingRegion === "india") {
      if (shippingIndia !== undefined && shippingIndia >= 0) {
        return {
          amount: shippingIndia,
          label:
            shippingIndia === 0
              ? "Free shipping"
              : `Shipping to India: ₹${(shippingIndia / 100).toFixed(2)}`,
        };
      }
    } else {
      if (shippingInternational !== undefined && shippingInternational >= 0) {
        return {
          amount: shippingInternational,
          label:
            shippingInternational === 0
              ? "Free international shipping"
              : `International shipping: $${(shippingInternational / 100).toFixed(2)}`,
        };
      }
    }
    return null;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        shippingRegion,
        setCurrency,
        setShippingRegion,
        formatPrice,
        getShipping,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
