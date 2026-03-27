import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import {
  Headphones,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../hooks/useCart";
import { useMetaTags } from "../hooks/useMetaTags";
import { useStore } from "../hooks/useStore";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById("razorpay-checkout-js")) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });
}

export default function CartPage() {
  useMetaTags({ title: "Cart — Mystoryova Store" });
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { addOrder, applyCoupon, incrementCouponUsage, updateOrderStatus } =
    useStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Shipping address state
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [pincode, setPincode] = useState("");
  const [country, setCountry] = useState("India");

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    message: string;
  } | null>(null);

  const hasMerchItems = items.some((i) => i.type === "merch");
  const discountAmount = appliedCoupon?.discount ?? 0;
  const adjustedTotal = Math.max(0, cartTotal - discountAmount);

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    const result = applyCoupon(code, cartTotal);
    if (result.valid) {
      setAppliedCoupon({
        code,
        discount: result.discount,
        message: result.message,
      });
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    if (hasMerchItems) {
      if (!addressLine1.trim()) {
        setError("Please enter your address line 1.");
        return;
      }
      if (!city.trim()) {
        setError("Please enter your city.");
        return;
      }
      if (!addressState.trim()) {
        setError("Please enter your state.");
        return;
      }
      if (!pincode.trim()) {
        setError("Please enter your PIN / postal code.");
        return;
      }
      if (!country.trim()) {
        setError("Please enter your country.");
        return;
      }
    }
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const razorpayKeyId = localStorage.getItem("mystoryova_rzp_key_id");
      if (!razorpayKeyId) {
        toast.error("Payment system is being set up. Please check back soon.");
        setLoading(false);
        return;
      }

      await loadRazorpayScript();

      const orderItems = items.map((i) => ({
        productId: i.productId,
        productType: i.type as "merch" | "audiobook",
        quantity: i.quantity,
        price: i.price,
        title: i.title,
      }));

      const shippingAddress = hasMerchItems
        ? {
            line1: addressLine1.trim(),
            line2: addressLine2.trim() || undefined,
            city: city.trim(),
            state: addressState.trim(),
            pincode: pincode.trim(),
            country: country.trim(),
          }
        : undefined;

      const order = addOrder({
        customerEmail: email.trim(),
        customerName: name.trim(),
        items: orderItems,
        totalAmount: adjustedTotal,
        stripeSessionId: "",
        status: "pending",
        shippingAddress,
      });

      if (appliedCoupon) {
        incrementCouponUsage(appliedCoupon.code);
      }

      const rzpOptions = {
        key: razorpayKeyId,
        amount: adjustedTotal,
        currency: "INR",
        name: "Mystoryova",
        description: items.map((i) => i.title).join(", "),
        prefill: {
          name: name.trim(),
          email: email.trim(),
          contact: phone.trim(),
        },
        theme: { color: "#c9a84c" },
        handler: (response: { razorpay_payment_id: string }) => {
          updateOrderStatus(order.id, "paid", response.razorpay_payment_id);
          window.location.href = `/store/success?order_id=${order.id}&payment_id=${response.razorpay_payment_id}`;
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(rzpOptions as Record<string, unknown>);
      rzp.open();
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Checkout failed. Please try again.";
      setError(msg);
      toast.error(msg);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-5"
          data-ocid="cart.empty_state"
        >
          <ShoppingCart className="w-16 h-16 text-primary/30 mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Your Cart is Empty
          </h2>
          <p className="text-muted-foreground">
            Add some audiobooks or merchandise to get started.
          </p>
          <Link to="/store">
            <Button className="bg-primary text-primary-foreground hover:brightness-110">
              Browse the Store
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Your Cart
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {items.length} item{items.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link to="/store" data-ocid="cart.link">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              ← Continue Shopping
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4" data-ocid="cart.list">
            <AnimatePresence>
              {items.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  data-ocid={`cart.item.${idx + 1}`}
                  className="glass rounded-2xl p-4 border border-white/10 flex gap-4 items-start"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-20 rounded-xl overflow-hidden shrink-0 bg-muted/30">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {item.type === "audiobook" ? (
                          <Headphones className="w-6 h-6 text-primary/40" />
                        ) : (
                          <ShoppingBag className="w-6 h-6 text-primary/40" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-foreground truncate">
                          {item.title}
                        </h3>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {item.type === "audiobook" ? "Audiobook" : item.type}
                        </Badge>
                        {item.selectedSize && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Size: {item.selectedSize}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        data-ocid={`cart.delete_button.${idx + 1}`}
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {item.type === "merch" ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-7 h-7 rounded-full border border-white/15 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-7 h-7 rounded-full border border-white/15 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Qty: 1
                        </span>
                      )}
                      <span className="font-bold text-primary">
                        ₹{((item.price * item.quantity) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div
              className="glass rounded-2xl p-6 border border-white/10"
              data-ocid="cart.card"
            >
              <h2 className="font-serif text-lg font-bold text-foreground mb-4">
                Order Summary
              </h2>
              <div className="space-y-2 text-sm">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-muted-foreground"
                  >
                    <span className="truncate mr-2">
                      {item.title} × {item.quantity}
                    </span>
                    <span>
                      ₹{((item.price * item.quantity) / 100).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-4 bg-white/10" />

              {/* Coupon Input */}
              <div className="mb-4">
                <AnimatePresence mode="wait">
                  {appliedCoupon ? (
                    <motion.div
                      key="applied"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1.5 text-green-400">
                          <Tag className="w-3.5 h-3.5" />
                          <span className="font-mono font-semibold">
                            {appliedCoupon.code}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          data-ocid="cart.toggle"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex justify-between text-sm text-green-400">
                        <span>Discount</span>
                        <span>
                          -₹{(appliedCoupon.discount / 100).toFixed(2)}
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="input"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="flex gap-2"
                    >
                      <Input
                        data-ocid="cart.input"
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleApplyCoupon()
                        }
                        placeholder="Coupon code"
                        className="bg-muted/30 border-white/10 text-sm h-9 font-mono uppercase placeholder:normal-case placeholder:font-sans"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim()}
                        className="h-9 px-3 border-primary/40 text-primary hover:bg-primary/10 whitespace-nowrap text-xs"
                        data-ocid="cart.secondary_button"
                      >
                        Apply
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Separator className="my-4 bg-white/10" />

              <div className="space-y-1">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{(cartTotal / 100).toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-green-400">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>-₹{(appliedCoupon.discount / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-foreground pt-1">
                  <span>Total</span>
                  <span className="text-primary text-lg">
                    ₹{(adjustedTotal / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer details + checkout */}
            <form
              onSubmit={handleCheckout}
              className="glass rounded-2xl p-6 border border-white/10 space-y-4"
              data-ocid="cart.panel"
            >
              <h2 className="font-serif text-lg font-bold text-foreground">
                Your Details
              </h2>
              <div>
                <Label
                  htmlFor="cart-name"
                  className="text-sm text-muted-foreground"
                >
                  Full Name
                </Label>
                <Input
                  id="cart-name"
                  data-ocid="cart.input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="O. Chiddarwar"
                  required
                  className="mt-1 bg-muted/30 border-white/10"
                />
              </div>
              <div>
                <Label
                  htmlFor="cart-email"
                  className="text-sm text-muted-foreground"
                >
                  Email Address
                </Label>
                <Input
                  id="cart-email"
                  data-ocid="cart.input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="mt-1 bg-muted/30 border-white/10"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Used to access purchased audiobooks in My Library.
                </p>
              </div>
              <div>
                <Label
                  htmlFor="cart-phone"
                  className="text-sm text-muted-foreground"
                >
                  Phone Number
                </Label>
                <Input
                  id="cart-phone"
                  data-ocid="cart.input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="mt-1 bg-muted/30 border-white/10"
                />
              </div>

              {/* Shipping Address — shown only for merch orders */}
              {hasMerchItems && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 border-t border-white/10 pt-4"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">
                      Shipping Address
                    </h3>
                  </div>
                  <div>
                    <Label
                      htmlFor="addr-line1"
                      className="text-sm text-muted-foreground"
                    >
                      Address Line 1 <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="addr-line1"
                      data-ocid="cart.input"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="House/Flat No., Street, Area"
                      className="mt-1 bg-muted/30 border-white/10"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="addr-line2"
                      className="text-sm text-muted-foreground"
                    >
                      Address Line 2
                    </Label>
                    <Input
                      id="addr-line2"
                      data-ocid="cart.input"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="Landmark, Locality (optional)"
                      className="mt-1 bg-muted/30 border-white/10"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label
                        htmlFor="addr-city"
                        className="text-sm text-muted-foreground"
                      >
                        City <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="addr-city"
                        data-ocid="cart.input"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Mumbai"
                        className="mt-1 bg-muted/30 border-white/10"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="addr-state"
                        className="text-sm text-muted-foreground"
                      >
                        State <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="addr-state"
                        data-ocid="cart.input"
                        value={addressState}
                        onChange={(e) => setAddressState(e.target.value)}
                        placeholder="Maharashtra"
                        className="mt-1 bg-muted/30 border-white/10"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label
                        htmlFor="addr-pincode"
                        className="text-sm text-muted-foreground"
                      >
                        PIN / Postal Code{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="addr-pincode"
                        data-ocid="cart.input"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="400001"
                        className="mt-1 bg-muted/30 border-white/10"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="addr-country"
                        className="text-sm text-muted-foreground"
                      >
                        Country <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="addr-country"
                        data-ocid="cart.input"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="India"
                        className="mt-1 bg-muted/30 border-white/10"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {error && (
                <p
                  className="text-sm text-destructive"
                  data-ocid="cart.error_state"
                >
                  {error}
                </p>
              )}
              <Button
                type="submit"
                data-ocid="cart.submit_button"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:brightness-110 gap-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <ShoppingCart className="w-4 h-4" />
                )}
                {loading ? "Opening Razorpay..." : "Proceed to Checkout"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Secure payment powered by Razorpay · UPI, Cards, Net Banking
                &amp; more
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
