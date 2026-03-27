import { createContext, useContext, useEffect, useState } from "react";

export interface MerchProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
  featured: boolean;
  sizes?: string[];
  stockBySize?: Record<string, number>;
  paymentLink?: string;
}

export interface AudiobookProduct {
  id: string;
  bookId: string;
  title: string;
  description: string;
  price: number;
  sampleUrl: string;
  fullAudioUrl: string;
  duration: string;
  coverUrl: string;
  narrator: string;
  paymentLink?: string;
}

export interface OrderItem {
  productId: string;
  productType: "merch" | "audiobook";
  quantity: number;
  price: number;
  title: string;
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Order {
  id: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  stripeSessionId: string;
  status: "pending" | "paid" | "fulfilled" | "cancelled";
  createdAt: string;
  shippingAddress?: ShippingAddress;
}

export interface Coupon {
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  active: boolean;
}

const SEED_MERCH: MerchProduct[] = [
  {
    id: "merch_1",
    title: "Mystoryova Literary Tee",
    description:
      'Premium cotton tee featuring the iconic Mystoryova logo and the tagline "Stories That Stay With You". Soft, comfortable, and perfect for the avid reader.',
    price: 2499,
    imageUrl: "",
    category: "T-Shirt",
    inStock: true,
    featured: true,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stockBySize: { XS: 10, S: 15, M: 20, L: 20, XL: 15, XXL: 10 },
  },
  {
    id: "merch_2",
    title: "The Ember Prophecy Hoodie",
    description:
      "Inspired by the world of The Ember Prophecy. A cozy, heavyweight hoodie with a subtle ember design on the chest. Perfect for late-night reading sessions.",
    price: 4499,
    imageUrl: "",
    category: "Hoodie",
    inStock: true,
    featured: true,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stockBySize: { XS: 8, S: 12, M: 18, L: 18, XL: 12, XXL: 8 },
  },
  {
    id: "merch_3",
    title: "Author's Morning Mug",
    description:
      "Start your day with stories. This ceramic mug features a handwritten quote from O. Chiddarwar on one side and the Mystoryova emblem on the other.",
    price: 1699,
    imageUrl: "",
    category: "Mug",
    inStock: true,
    featured: false,
  },
  {
    id: "merch_4",
    title: "The Long Climb Tote Bag",
    description:
      "A sturdy canvas tote inspired by The Long Climb. Features original artwork and a quote from the book. Holds your next great adventure.",
    price: 1999,
    imageUrl: "",
    category: "Tote Bag",
    inStock: true,
    featured: false,
  },
  {
    id: "merch_5",
    title: "Letter in the Rain Art Print",
    description:
      "A signed art poster inspired by The Letter in the Rain. Printed on archival matte paper. A beautiful addition to any reader's space.",
    price: 2999,
    imageUrl: "",
    category: "Poster",
    inStock: true,
    featured: true,
  },
];

const SEED_AUDIOBOOKS: AudiobookProduct[] = [
  {
    id: "audio_1",
    bookId: "1",
    title: "The Long Climb",
    description:
      "An emotional journey of perseverance and self-discovery. Listen to this powerful story narrated with depth and warmth, bringing every character vividly to life.",
    price: 1499,
    sampleUrl: "",
    fullAudioUrl: "",
    duration: "6h 42m",
    coverUrl: "",
    narrator: "O. Chiddarwar",
  },
  {
    id: "audio_2",
    bookId: "2",
    title: "The Ember Prophecy",
    description:
      "A spellbinding fantasy epic narrated with passion and intensity. Experience the world of prophecy and destiny in stunning audio detail.",
    price: 1799,
    sampleUrl: "",
    fullAudioUrl: "",
    duration: "9h 15m",
    coverUrl: "",
    narrator: "O. Chiddarwar",
  },
  {
    id: "audio_3",
    bookId: "3",
    title: "The Letter in the Rain",
    description:
      "A romantic and poignant story of love, loss, and letters never sent. Hear every heartbeat in this exquisite audio performance.",
    price: 1299,
    sampleUrl: "",
    fullAudioUrl: "",
    duration: "5h 58m",
    coverUrl: "",
    narrator: "O. Chiddarwar",
  },
];

const SEED_COUPONS: Coupon[] = [
  {
    code: "WELCOME10",
    discountType: "percent",
    discountValue: 10,
    active: true,
    usedCount: 0,
  },
];

interface StoreContextValue {
  merch: MerchProduct[];
  audiobooks: AudiobookProduct[];
  orders: Order[];
  coupons: Coupon[];
  addMerch: (p: Omit<MerchProduct, "id">) => void;
  updateMerch: (id: string, p: Partial<MerchProduct>) => void;
  deleteMerch: (id: string) => void;
  addAudiobook: (a: Omit<AudiobookProduct, "id">) => void;
  updateAudiobook: (id: string, a: Partial<AudiobookProduct>) => void;
  deleteAudiobook: (id: string) => void;
  addOrder: (o: Omit<Order, "id" | "createdAt">) => Order;
  updateOrderStatus: (
    id: string,
    status: Order["status"],
    sessionId?: string,
  ) => void;
  getPurchasedAudiobooks: (email: string) => AudiobookProduct[];
  addCoupon: (c: Omit<Coupon, "usedCount">) => void;
  updateCoupon: (code: string, c: Partial<Coupon>) => void;
  deleteCoupon: (code: string) => void;
  applyCoupon: (
    code: string,
    cartTotal: number,
  ) => { valid: boolean; discount: number; message: string };
  incrementCouponUsage: (code: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function load<T>(key: string, seed: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : seed;
  } catch {
    return seed;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [merch, setMerch] = useState<MerchProduct[]>(() =>
    load("mystoryova_merch", SEED_MERCH),
  );
  const [audiobooks, setAudiobooks] = useState<AudiobookProduct[]>(() =>
    load("mystoryova_audiobooks", SEED_AUDIOBOOKS),
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    load("mystoryova_orders", []),
  );
  const [coupons, setCoupons] = useState<Coupon[]>(() =>
    load("mystoryova_coupons", SEED_COUPONS),
  );

  useEffect(() => {
    localStorage.setItem("mystoryova_merch", JSON.stringify(merch));
  }, [merch]);
  useEffect(() => {
    localStorage.setItem("mystoryova_audiobooks", JSON.stringify(audiobooks));
  }, [audiobooks]);
  useEffect(() => {
    localStorage.setItem("mystoryova_orders", JSON.stringify(orders));
  }, [orders]);
  useEffect(() => {
    localStorage.setItem("mystoryova_coupons", JSON.stringify(coupons));
  }, [coupons]);

  const addMerch = (p: Omit<MerchProduct, "id">) => {
    setMerch((prev) => [...prev, { ...p, id: `merch_${Date.now()}` }]);
  };
  const updateMerch = (id: string, p: Partial<MerchProduct>) => {
    setMerch((prev) => prev.map((m) => (m.id === id ? { ...m, ...p } : m)));
  };
  const deleteMerch = (id: string) => {
    setMerch((prev) => prev.filter((m) => m.id !== id));
  };

  const addAudiobook = (a: Omit<AudiobookProduct, "id">) => {
    setAudiobooks((prev) => [...prev, { ...a, id: `audio_${Date.now()}` }]);
  };
  const updateAudiobook = (id: string, a: Partial<AudiobookProduct>) => {
    setAudiobooks((prev) =>
      prev.map((ab) => (ab.id === id ? { ...ab, ...a } : ab)),
    );
  };
  const deleteAudiobook = (id: string) => {
    setAudiobooks((prev) => prev.filter((ab) => ab.id !== id));
  };

  const addOrder = (o: Omit<Order, "id" | "createdAt">): Order => {
    const order: Order = {
      ...o,
      id: `order_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [...prev, order]);
    return order;
  };

  const updateOrderStatus = (
    id: string,
    status: Order["status"],
    sessionId?: string,
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, status, stripeSessionId: sessionId ?? o.stripeSessionId }
          : o,
      ),
    );
  };

  const getPurchasedAudiobooks = (email: string): AudiobookProduct[] => {
    const paidOrders = orders.filter(
      (o) =>
        o.customerEmail.toLowerCase() === email.toLowerCase() &&
        (o.status === "paid" || o.status === "fulfilled"),
    );
    const purchasedIds = new Set<string>();
    for (const order of paidOrders) {
      for (const item of order.items) {
        if (item.productType === "audiobook") purchasedIds.add(item.productId);
      }
    }
    return audiobooks.filter((ab) => purchasedIds.has(ab.id));
  };

  const addCoupon = (c: Omit<Coupon, "usedCount">) => {
    setCoupons((prev) => [
      ...prev,
      { ...c, code: c.code.toUpperCase(), usedCount: 0 },
    ]);
  };

  const updateCoupon = (code: string, c: Partial<Coupon>) => {
    setCoupons((prev) =>
      prev.map((cp) =>
        cp.code.toUpperCase() === code.toUpperCase() ? { ...cp, ...c } : cp,
      ),
    );
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) =>
      prev.filter((cp) => cp.code.toUpperCase() !== code.toUpperCase()),
    );
  };

  const applyCoupon = (
    code: string,
    cartTotal: number,
  ): { valid: boolean; discount: number; message: string } => {
    const coupon = coupons.find(
      (cp) => cp.code.toUpperCase() === code.toUpperCase(),
    );
    if (!coupon) {
      return { valid: false, discount: 0, message: "Invalid coupon code." };
    }
    if (!coupon.active) {
      return {
        valid: false,
        discount: 0,
        message: "This coupon is no longer active.",
      };
    }
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return {
        valid: false,
        discount: 0,
        message: "This coupon has reached its usage limit.",
      };
    }
    if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order of $${(coupon.minOrderAmount / 100).toFixed(2)} required.`,
      };
    }
    let discount = 0;
    if (coupon.discountType === "percent") {
      discount = Math.round((cartTotal * coupon.discountValue) / 100);
    } else {
      discount = Math.min(coupon.discountValue, cartTotal);
    }
    const label =
      coupon.discountType === "percent"
        ? `${coupon.discountValue}%`
        : `$${(coupon.discountValue / 100).toFixed(2)}`;
    return { valid: true, discount, message: `${label} discount applied!` };
  };

  const incrementCouponUsage = (code: string) => {
    setCoupons((prev) =>
      prev.map((cp) =>
        cp.code.toUpperCase() === code.toUpperCase()
          ? { ...cp, usedCount: cp.usedCount + 1 }
          : cp,
      ),
    );
  };

  return (
    <StoreContext.Provider
      value={{
        merch,
        audiobooks,
        orders,
        coupons,
        addMerch,
        updateMerch,
        deleteMerch,
        addAudiobook,
        updateAudiobook,
        deleteAudiobook,
        addOrder,
        updateOrderStatus,
        getPurchasedAudiobooks,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        applyCoupon,
        incrementCouponUsage,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
