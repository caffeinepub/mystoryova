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
import { Eye, KeyRound, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
              ₹{(order.totalAmount / 100).toFixed(2)}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-muted-foreground">Date</p>
            <p className="text-foreground text-sm">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          {order.stripeSessionId && (
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground">
                Razorpay Payment ID
              </p>
              <p className="text-foreground font-mono text-xs break-all">
                {order.stripeSessionId}
              </p>
            </div>
          )}
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
                  ₹{((item.price * item.quantity) / 100).toFixed(2)}
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [rzpKeyId, setRzpKeyId] = useState(
    () => localStorage.getItem("mystoryova_rzp_key_id") ?? "",
  );

  const handleSaveRazorpay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rzpKeyId.trim()) {
      toast.error("Please enter your Razorpay Key ID.");
      return;
    }
    localStorage.setItem("mystoryova_rzp_key_id", rzpKeyId.trim());
    toast.success("Razorpay Key ID saved successfully.");
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
                    ₹{(order.totalAmount / 100).toFixed(2)}
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

      {/* Razorpay Config */}
      <div className="glass rounded-2xl p-6 border border-white/10 max-w-lg">
        <div className="flex items-center gap-2 mb-5">
          <KeyRound className="w-5 h-5 text-primary" />
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Razorpay Configuration
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Enter your Key ID (starts with{" "}
          <code className="font-mono">rzp_live_</code> or{" "}
          <code className="font-mono">rzp_test_</code>). Find it in{" "}
          <strong>Razorpay Dashboard → Settings → API Keys</strong>.
        </p>
        <form onSubmit={handleSaveRazorpay} className="space-y-4">
          <div>
            <Label
              htmlFor="rzp-key-id"
              className="text-sm text-muted-foreground"
            >
              Razorpay Key ID
            </Label>
            <Input
              id="rzp-key-id"
              data-ocid="admin.input"
              value={rzpKeyId}
              onChange={(e) => setRzpKeyId(e.target.value)}
              placeholder="rzp_live_xxxxxxxxxxxx"
              className="mt-1 bg-muted/30 border-white/10 font-mono"
            />
          </div>
          <Button
            type="submit"
            data-ocid="admin.save_button"
            className="bg-primary text-primary-foreground hover:brightness-110 gap-2"
          >
            <KeyRound className="w-4 h-4" />
            Save Razorpay Key
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
