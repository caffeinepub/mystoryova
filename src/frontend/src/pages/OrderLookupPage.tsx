import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { Headphones, Package, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useMetaTags } from "../hooks/useMetaTags";
import { useStore } from "../hooks/useStore";
import type { Order } from "../hooks/useStore";

const STATUS_COLORS: Record<Order["status"], string> = {
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/40",
  paid: "bg-green-500/20 text-green-400 border-green-500/40",
  fulfilled: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/40",
};

export default function OrderLookupPage() {
  useMetaTags({ title: "Track Your Order — Mystoryova" });
  const { orders } = useStore();
  const [email, setEmail] = useState("");
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<Order[]>([]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.filter(
      (o) => o.customerEmail.toLowerCase() === email.trim().toLowerCase(),
    );
    setResults(found);
    setSearched(true);
  };

  const hasAudiobookOrders = results.some(
    (o) =>
      (o.status === "paid" || o.status === "fulfilled") &&
      o.items.some((i) => i.productType === "audiobook"),
  );

  return (
    <div className="min-h-screen">
      <div className="relative py-20 px-6 cinematic-bg">
        <div className="absolute inset-0 vignette pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <Package className="w-10 h-10 text-primary mx-auto mb-3" />
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Track Your Order
            </h1>
            <p className="text-muted-foreground mt-2">
              Enter the email address you used at checkout to find your orders.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleLookup}
            className="glass rounded-2xl p-6 border border-white/10 space-y-4"
            data-ocid="orders.panel"
          >
            <label
              htmlFor="order-email"
              className="text-sm font-medium text-foreground block"
            >
              Email Address
            </label>
            <div className="flex gap-3">
              <Input
                id="order-email"
                type="email"
                required
                data-ocid="orders.input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-muted/30 border-white/10 flex-1"
              />
              <Button
                type="submit"
                data-ocid="orders.submit_button"
                className="bg-primary text-primary-foreground hover:brightness-110 gap-2 shrink-0"
              >
                <Search className="w-4 h-4" />
                Look Up
              </Button>
            </div>
          </motion.form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-2xl mx-auto px-6 py-10 space-y-5">
        <AnimatePresence>
          {searched && results.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass rounded-2xl p-8 border border-white/10 text-center"
              data-ocid="orders.empty_state"
            >
              <Package className="w-10 h-10 text-primary/30 mx-auto mb-3" />
              <p className="text-foreground font-medium">
                No orders found for this email address.
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Make sure you use the same email entered at checkout.
              </p>
            </motion.div>
          )}

          {results.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              data-ocid={`orders.item.${i + 1}`}
              className="glass rounded-2xl p-6 border border-white/10 space-y-4"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-xs text-muted-foreground font-mono">
                    Order #{order.id.split("_")[1]}
                  </p>
                  <p className="text-sm text-foreground mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${
                    STATUS_COLORS[order.status]
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      {item.productType === "audiobook" ? (
                        <Headphones className="w-3.5 h-3.5 text-primary/60" />
                      ) : (
                        <Package className="w-3.5 h-3.5 text-primary/60" />
                      )}
                      <span className="text-foreground">{item.title}</span>
                      <Badge variant="secondary" className="text-xs">
                        ×{item.quantity}
                      </Badge>
                    </div>
                    <span className="text-muted-foreground">
                      ₹{((item.price * item.quantity) / 100).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-bold text-primary">
                  ₹{(order.totalAmount / 100).toFixed(2)}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {searched && hasAudiobookOrders && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-2xl p-4 border border-primary/30 bg-primary/5 flex items-center gap-3"
          >
            <Headphones className="w-5 h-5 text-primary shrink-0" />
            <p className="text-sm text-foreground flex-1">
              You have purchased audiobooks.{" "}
              <Link
                to="/store/library"
                className="text-primary hover:underline font-medium"
                data-ocid="orders.link"
              >
                Access your library →
              </Link>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
