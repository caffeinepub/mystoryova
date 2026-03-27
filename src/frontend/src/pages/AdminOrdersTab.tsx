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
import {
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  Eye,
  KeyRound,
  MapPin,
  Package,
} from "lucide-react";
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

const PRINTROVE_URL = "https://merchants.printrove.com";

function hasMerchItems(order: Order) {
  return order.items.some((i) => i.productType === "merch");
}

function isPendingMerch(order: Order) {
  return (
    (order.status === "paid" || order.status === "pending") &&
    hasMerchItems(order)
  );
}

function OrderDetailModal({
  order,
  onClose,
  onMarkFulfilled,
}: {
  order: Order;
  onClose: () => void;
  onMarkFulfilled: (id: string) => void;
}) {
  const addr = order.shippingAddress;
  const hasMerch = hasMerchItems(order);
  const isPending = order.status === "paid" || order.status === "pending";

  const copyAddress = () => {
    if (!addr) return;
    const text = [
      addr.line1,
      addr.line2,
      `${addr.city}, ${addr.state} — ${addr.pincode}`,
      addr.country,
    ]
      .filter(Boolean)
      .join("\n");
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Address copied to clipboard"));
  };

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
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Shipping Address
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 text-xs text-muted-foreground hover:text-foreground gap-1 px-2"
                onClick={copyAddress}
                data-ocid="admin.copy_button"
              >
                <ClipboardList className="w-3 h-3" />
                Copy
              </Button>
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

        {/* Printrove Fulfillment Status */}
        {hasMerch && isPending && (
          <div className="border-t border-amber-500/20 pt-4">
            <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-4 h-4 text-amber-400" />
                <p className="text-sm font-semibold text-amber-300">
                  Pending Printrove Fulfillment
                </p>
              </div>
              <p className="text-xs text-amber-200/70 mb-3">
                This order contains merchandise. Submit it to Printrove to begin
                printing and shipping.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10 gap-1.5 text-xs"
                  onClick={() => window.open(PRINTROVE_URL, "_blank")}
                  data-ocid="admin.open_modal_button"
                >
                  <ExternalLink className="w-3 h-3" />
                  Open Printrove
                </Button>
                <Button
                  size="sm"
                  className="bg-amber-500 hover:bg-amber-400 text-black gap-1.5 text-xs"
                  onClick={() => {
                    onMarkFulfilled(order.id);
                    onClose();
                  }}
                  data-ocid="admin.confirm_button"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  Mark Submitted to Printrove
                </Button>
              </div>
            </div>
          </div>
        )}

        {hasMerch && order.status === "fulfilled" && (
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Submitted to Printrove for fulfillment</span>
            </div>
          </div>
        )}

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
  const { orders, updateOrderStatus } = useStore();
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

  const handleMarkFulfilled = (orderId: string) => {
    updateOrderStatus(orderId, "fulfilled");
    toast.success("Order marked as submitted to Printrove.");
  };

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const pendingMerchOrders = sortedOrders.filter(isPendingMerch);

  return (
    <div className="space-y-10">
      {/* Printrove Fulfillment Panel */}
      <div className="glass rounded-2xl p-6 border border-amber-500/20 bg-amber-500/5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif text-xl font-semibold text-foreground">
              Printrove Fulfillment
            </h2>
          </div>
          {pendingMerchOrders.length > 0 && (
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
              {pendingMerchOrders.length} pending
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          Manual workflow for print-on-demand orders
        </p>

        {/* Step-by-step guide */}
        <div className="bg-black/20 border border-amber-500/10 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="w-4 h-4 text-amber-400" />
            <p className="text-sm font-semibold text-amber-300">
              Fulfillment Steps
            </p>
          </div>
          <ol className="space-y-3 text-sm">
            {(
              [
                {
                  label: "Log into Printrove",
                  desc: (
                    <>
                      Go to{" "}
                      <a
                        href={PRINTROVE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 underline underline-offset-2 hover:text-amber-300 inline-flex items-center gap-0.5"
                      >
                        merchants.printrove.com
                        <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                      </a>
                    </>
                  ),
                },
                {
                  label: "Create a New Order",
                  desc: "Select the product, size, and color matching the customer's order.",
                },
                {
                  label: "Upload Your Design",
                  desc: "Upload print design file (PNG or PDF, minimum 300 DPI).",
                },
                {
                  label: "Enter Shipping Details",
                  desc: "Copy from the order below: name, address, city, state, pincode, phone.",
                },
                {
                  label: "Pay & Confirm",
                  desc: "Pay Printrove for product + printing + shipping to complete the order.",
                },
                {
                  label: "Mark as Submitted",
                  desc: 'Click the "Mark Done" button on the order card below to update its status.',
                },
              ] as { label: string; desc: React.ReactNode }[]
            ).map((step) => (
              <li key={step.label} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center justify-center">
                  {[
                    "Log into Printrove",
                    "Create a New Order",
                    "Upload Your Design",
                    "Enter Shipping Details",
                    "Pay & Confirm",
                    "Mark as Submitted",
                  ].indexOf(step.label) + 1}
                </span>
                <div>
                  <span className="text-foreground font-medium">
                    {step.label}
                  </span>
                  {" — "}
                  <span className="text-muted-foreground">{step.desc}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Pending merch orders list */}
        {pendingMerchOrders.length === 0 ? (
          <div
            className="flex items-center gap-2 text-green-400 text-sm"
            data-ocid="admin.empty_state"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>All merch orders have been submitted to Printrove.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingMerchOrders.map((order, i) => {
              const addr = order.shippingAddress;
              const merchItems = order.items.filter(
                (it) => it.productType === "merch",
              );
              return (
                <div
                  key={order.id}
                  data-ocid={`admin.item.${i + 1}`}
                  className="bg-black/30 border border-amber-500/15 rounded-xl p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {order.customerName}
                        </p>
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {order.customerEmail}
                      </p>
                      {addr && (
                        <p className="text-xs text-muted-foreground">
                          📍 {addr.city}, {addr.state} {addr.pincode}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {merchItems.map((item) => (
                          <Badge
                            key={item.productId}
                            variant="secondary"
                            className="text-xs"
                          >
                            {item.title} ×{item.quantity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs h-8 gap-1"
                        onClick={() => setSelectedOrder(order)}
                        data-ocid={`admin.button.${i + 1}`}
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10 text-xs h-8 gap-1"
                        onClick={() => window.open(PRINTROVE_URL, "_blank")}
                        data-ocid={`admin.secondary_button.${i + 1}`}
                      >
                        <ExternalLink className="w-3 h-3" />
                        Printrove
                      </Button>
                      <Button
                        size="sm"
                        className="bg-amber-500 hover:bg-amber-400 text-black text-xs h-8 gap-1"
                        onClick={() => handleMarkFulfilled(order.id)}
                        data-ocid={`admin.confirm_button.${i + 1}`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Mark Done
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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
                    <span className="flex items-center gap-1.5">
                      {order.customerName}
                      {isPendingMerch(order) && (
                        <Package className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      )}
                    </span>
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
            onMarkFulfilled={handleMarkFulfilled}
          />
        )}
      </Dialog>
    </div>
  );
}
