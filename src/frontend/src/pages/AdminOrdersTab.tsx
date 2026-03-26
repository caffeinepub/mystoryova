import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, KeyRound, Loader2, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useStore } from "../hooks/useStore";
import type { Order } from "../hooks/useStore";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  paid: "bg-green-500/20 text-green-400 border-green-500/30",
  fulfilled: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

function OrderDetailModal({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  const addr = order.shippingAddress;
  return (
    <DialogContent className="max-w-lg glass border border-white/15">
      <DialogHeader>
        <DialogTitle className="font-serif">Order Details</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Customer</p>
            <p className="text-foreground font-medium">{order.customerName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-foreground">{order.customerEmail}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <Badge className={`text-xs ${STATUS_COLORS[order.status]}`}>
              {order.status}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-primary font-bold">
              ${(order.totalAmount / 100).toFixed(2)}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-muted-foreground">Date</p>
            <p className="text-foreground text-sm">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Shipping Address */}
        {addr && (
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center gap-1.5 mb-2">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Shipping Address
              </p>
            </div>
            <div className="bg-muted/20 rounded-xl px-4 py-3 text-sm text-foreground leading-relaxed">
              <p>{addr.line1}</p>
              {addr.line2 && <p>{addr.line2}</p>}
              <p>
                {addr.city}, {addr.state} — {addr.pincode}
              </p>
              <p>{addr.country}</p>
            </div>
          </div>
        )}

        <div className="border-t border-white/10 pt-4">
          <p className="text-xs text-muted-foreground mb-3">Items</p>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div
                key={item.productId + item.productType}
                className="flex justify-between items-center text-sm"
              >
                <div>
                  <span className="text-foreground">{item.title}</span>
                  <Badge variant="secondary" className="text-xs ml-2">
                    {item.productType}
                  </Badge>
                  <span className="text-muted-foreground text-xs ml-1">
                    ×{item.quantity}
                  </span>
                </div>
                <span className="text-primary">
                  ${((item.price * item.quantity) / 100).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full border-white/15"
          onClick={onClose}
          data-ocid="admin.close_button"
        >
          Close
        </Button>
      </div>
    </DialogContent>
  );
}

export default function AdminOrdersTab() {
  const { orders } = useStore();
  const { actor } = useActor();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [stripeKey, setStripeKey] = useState("");
  const [allowedCountries, setAllowedCountries] = useState("US,GB,CA,AU,IN");
  const [savingStripe, setSavingStripe] = useState(false);

  const handleSaveStripe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripeKey.trim()) {
      toast.error("Please enter a Stripe secret key.");
      return;
    }
    setSavingStripe(true);
    try {
      await actor?.setStripeConfiguration({
        secretKey: stripeKey.trim(),
        allowedCountries: allowedCountries
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      toast.success("Stripe configured successfully.");
      setStripeKey("");
    } catch {
      toast.error("Failed to save Stripe configuration.");
    } finally {
      setSavingStripe(false);
    }
  };

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="space-y-10">
      {/* Orders Table */}
      <div>
        <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
          Orders ({orders.length})
        </h2>
        <div className="glass rounded-2xl overflow-hidden">
          <Table data-ocid="admin.table">
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedOrders.map((order, i) => (
                <TableRow
                  key={order.id}
                  data-ocid={`admin.row.${i + 1}`}
                  className="border-white/10"
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {order.id.slice(-8)}
                  </TableCell>
                  <TableCell className="text-foreground font-medium">
                    {order.customerName}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {order.customerEmail}
                  </TableCell>
                  <TableCell className="text-primary font-medium">
                    ${(order.totalAmount / 100).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-xs ${STATUS_COLORS[order.status] ?? ""}`}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {order.items.length}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      data-ocid={`admin.button.${i + 1}`}
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-muted-foreground py-10"
                    data-ocid="admin.empty_state"
                  >
                    No orders yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Stripe Config */}
      <div className="glass rounded-2xl p-6 border border-white/10 max-w-lg">
        <div className="flex items-center gap-2 mb-5">
          <KeyRound className="w-5 h-5 text-primary" />
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Stripe Configuration
          </h2>
        </div>
        <form onSubmit={handleSaveStripe} className="space-y-4">
          <div>
            <Label
              htmlFor="stripe-key"
              className="text-sm text-muted-foreground"
            >
              Stripe Secret Key
            </Label>
            <Input
              id="stripe-key"
              data-ocid="admin.input"
              type="password"
              value={stripeKey}
              onChange={(e) => setStripeKey(e.target.value)}
              placeholder="sk_live_... or sk_test_..."
              className="mt-1 bg-muted/30 border-white/10"
            />
          </div>
          <div>
            <Label
              htmlFor="stripe-countries"
              className="text-sm text-muted-foreground"
            >
              Allowed Countries (comma-separated ISO codes)
            </Label>
            <Input
              id="stripe-countries"
              data-ocid="admin.input"
              value={allowedCountries}
              onChange={(e) => setAllowedCountries(e.target.value)}
              placeholder="US,GB,CA,AU,IN"
              className="mt-1 bg-muted/30 border-white/10"
            />
          </div>
          <Button
            type="submit"
            data-ocid="admin.save_button"
            disabled={savingStripe}
            className="bg-primary text-primary-foreground hover:brightness-110 gap-2"
          >
            {savingStripe ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <KeyRound className="w-4 h-4" />
            )}
            {savingStripe ? "Saving..." : "Save Stripe Config"}
          </Button>
        </form>
      </div>

      {/* Order Detail Modal */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      >
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </Dialog>
    </div>
  );
}
