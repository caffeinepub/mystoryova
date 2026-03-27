import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle,
  Headphones,
  Package,
  RotateCcw,
  ShoppingBag,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../hooks/useCart";
import { useMetaTags } from "../hooks/useMetaTags";
import { useStore } from "../hooks/useStore";
import type { Order } from "../hooks/useStore";

export default function OrderSuccessPage() {
  useMetaTags({ title: "Order Confirmed — Mystoryova Store" });
  const { clearCart } = useCart();
  const { orders, updateOrderStatus } = useStore();

  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<"loading" | "confirmed" | "error">(
    "loading",
  );
  const [errorMsg, setErrorMsg] = useState("");
  const confirmed = useRef(false);

  useEffect(() => {
    if (confirmed.current) return;
    confirmed.current = true;

    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order_id");
    const paymentId =
      params.get("payment_id") ?? params.get("razorpay_payment_id") ?? "";

    if (!orderId) {
      setStatus("error");
      setErrorMsg("Missing order information.");
      return;
    }

    const foundOrder = orders.find((o) => o.id === orderId);
    if (!foundOrder) {
      setStatus("error");
      setErrorMsg("Order not found.");
      return;
    }

    setOrder(foundOrder);
    updateOrderStatus(orderId, "paid", paymentId);
    setOrder({ ...foundOrder, status: "paid", stripeSessionId: paymentId });
    clearCart();
    setStatus("confirmed");
  }, [orders, updateOrderStatus, clearCart]);

  const hasAudiobooks = order?.items.some((i) => i.productType === "audiobook");
  const hasMerch = order?.items.some((i) => i.productType === "merch");

  const returnMailto = order
    ? `mailto:mystoryova@gmail.com?subject=Return Request — Order ${order.id}&body=Hi,%0A%0AI would like to request a return for the following order:%0A%0AOrder ID: ${order.id}%0ACustomer Name: ${order.customerName}%0AEmail: ${order.customerEmail}%0A%0AItems I wish to return:%0A${order.items.map((i) => `- ${i.title} (x${i.quantity})`).join("%0A")}%0A%0AReason for return:%0A`
    : "mailto:mystoryova@gmail.com?subject=Return Request";

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4" data-ocid="order.loading_state">
          <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Confirming your order...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-4" data-ocid="order.error_state">
          <p className="text-destructive font-medium">{errorMsg}</p>
          <Link to="/store">
            <Button variant="outline">Return to Store</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg space-y-8"
        data-ocid="order.success_state"
      >
        {/* Success Icon */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-20 h-20 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-10 h-10 text-primary" />
          </motion.div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground mt-2">
            Thank you, {order?.customerName}. Your order has been received.
          </p>
        </div>

        {/* Order Details */}
        {order && (
          <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground tracking-widest">
                ORDER
              </span>
              <code className="text-xs text-primary font-mono">{order.id}</code>
            </div>
            <Separator className="bg-white/10" />
            <div className="space-y-3">
              {order.items.map((item, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: order items are stable
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.productType === "audiobook" ? (
                      <Headphones className="w-4 h-4 text-primary shrink-0" />
                    ) : (
                      <ShoppingBag className="w-4 h-4 text-primary shrink-0" />
                    )}
                    <span className="text-sm text-foreground">
                      {item.title}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      ×{item.quantity}
                    </Badge>
                  </div>
                  <span className="text-sm font-medium text-primary">
                    ₹{((item.price * item.quantity) / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <Separator className="bg-white/10" />
            <div className="flex justify-between font-bold">
              <span>Total Paid</span>
              <span className="text-primary">
                ₹{(order.totalAmount / 100).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Audiobook access note */}
        {hasAudiobooks && (
          <div className="glass rounded-xl p-4 border border-primary/30 bg-primary/5">
            <div className="flex items-center gap-2 mb-2">
              <Headphones className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                Your Audiobooks are Ready
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Access your audiobooks at{" "}
              <Link
                to="/store/library"
                className="text-primary hover:underline"
              >
                My Library
              </Link>{" "}
              using email{" "}
              <span className="font-mono text-foreground text-xs">
                {order?.customerEmail}
              </span>
              .
            </p>
          </div>
        )}

        {/* Merch shipping note */}
        {hasMerch && (
          <div className="glass rounded-xl p-4 border border-white/15">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                Merchandise Shipping
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your merchandise will be produced and shipped within 3–5 business
              days. Returns accepted within 14 days of delivery.{" "}
              <Link
                to="/return-policy"
                className="text-primary hover:underline"
              >
                Return Policy
              </Link>
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <Link to="/store" className="flex-1">
            <Button
              variant="outline"
              className="w-full border-white/15 hover:border-primary/50"
              data-ocid="order.button"
            >
              Continue Shopping
            </Button>
          </Link>
          {hasAudiobooks && (
            <Link to="/store/library" className="flex-1">
              <Button
                className="w-full bg-primary text-primary-foreground hover:brightness-110 gap-2"
                data-ocid="order.primary_button"
              >
                <Headphones className="w-4 h-4" /> My Library
              </Button>
            </Link>
          )}
        </div>

        {/* Return request */}
        <div className="glass rounded-xl p-4 border border-white/10">
          <p className="text-sm text-muted-foreground mb-3">
            Changed your mind or received a damaged item?
          </p>
          <a href={returnMailto}>
            <Button
              variant="outline"
              className="w-full gap-2 border-primary/30 text-primary hover:bg-primary/10"
              data-ocid="order.return_button"
            >
              <RotateCcw className="w-4 h-4" />
              Request a Return
            </Button>
          </a>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            View our{" "}
            <Link to="/return-policy" className="text-primary hover:underline">
              Return Policy
            </Link>{" "}
            for eligibility and timelines.
          </p>
        </div>
        <p className="text-sm text-center text-muted-foreground mt-2">
          Need to check your order status?{" "}
          <Link
            to="/store/orders"
            className="text-primary hover:underline"
            data-ocid="order.link"
          >
            Track your order
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
