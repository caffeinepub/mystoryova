import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Ruler, ShoppingCart, Truck, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import StarRating from "../components/StarRating";
import { RAZORPAY_MERCH_LINKS } from "../config/razorpayLinks";
import { useCart } from "../hooks/useCart";
import { useCurrency } from "../hooks/useCurrency";
import { useMetaTags } from "../hooks/useMetaTags";
import { useStore } from "../hooks/useStore";

const MERCH_GRADIENTS: Record<string, string> = {
  "T-Shirt": "from-primary/30 to-secondary/60",
  Hoodie: "from-blue-900/40 to-primary/30",
  Mug: "from-amber-900/40 to-primary/20",
  "Tote Bag": "from-emerald-900/30 to-secondary/50",
  Poster: "from-purple-900/30 to-primary/30",
  Other: "from-secondary/50 to-muted/80",
};

const SIZE_CHART = [
  {
    size: "XS",
    chestCm: "86–91",
    chestIn: "34–36",
    lengthCm: "66",
    lengthIn: "26",
  },
  {
    size: "S",
    chestCm: "91–96",
    chestIn: "36–38",
    lengthCm: "68",
    lengthIn: "26.8",
  },
  {
    size: "M",
    chestCm: "96–101",
    chestIn: "38–40",
    lengthCm: "70",
    lengthIn: "27.6",
  },
  {
    size: "L",
    chestCm: "101–106",
    chestIn: "40–42",
    lengthCm: "72",
    lengthIn: "28.3",
  },
  {
    size: "XL",
    chestCm: "106–111",
    chestIn: "42–44",
    lengthCm: "74",
    lengthIn: "29.1",
  },
  {
    size: "XXL",
    chestCm: "116–121",
    chestIn: "46–48",
    lengthCm: "76",
    lengthIn: "29.9",
  },
];

const CLOTHING_KEYWORDS = [
  "shirt",
  "hoodie",
  "apparel",
  "clothing",
  "tshirt",
  "t-shirt",
];

function isClothing(category: string): boolean {
  return CLOTHING_KEYWORDS.some((kw) => category.toLowerCase().includes(kw));
}

function MerchPlaceholder({ category }: { category: string }) {
  return (
    <div
      className={`w-full h-full bg-gradient-to-br ${
        MERCH_GRADIENTS[category] ?? MERCH_GRADIENTS.Other
      } flex items-center justify-center`}
    >
      <ShoppingCart className="w-16 h-16 text-primary/40" />
    </div>
  );
}

function SizeChartModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          data-ocid="store.open_modal_button"
          className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
        >
          <Ruler className="w-3.5 h-3.5" /> Size Chart
        </button>
      </DialogTrigger>
      <DialogContent
        className="max-w-lg bg-card border border-white/10"
        data-ocid="store.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-serif text-lg text-foreground">
            Size Chart
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground mb-3">
          All measurements are approximate. For the best fit, measure yourself
          and compare with the chart below.
        </p>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="text-primary text-xs">Size</TableHead>
              <TableHead className="text-primary text-xs">Chest (cm)</TableHead>
              <TableHead className="text-primary text-xs">Chest (in)</TableHead>
              <TableHead className="text-primary text-xs">
                Length (cm)
              </TableHead>
              <TableHead className="text-primary text-xs">
                Length (in)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SIZE_CHART.map((row) => (
              <TableRow
                key={row.size}
                className="border-white/10 hover:bg-white/5"
              >
                <TableCell className="font-semibold text-foreground text-sm">
                  {row.size}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {row.chestCm}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {row.chestIn}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {row.lengthCm}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {row.lengthIn}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}

export default function MerchDetailPage() {
  const { id } = useParams({ from: "/store/merch/$id" });
  const { merch } = useStore();
  const { addToCart, items } = useCart();
  const { formatPrice, getShipping, shippingRegion } = useCurrency();
  const [selectedSize, setSelectedSize] = useState("");

  const product = merch.find((m) => m.id === id) ?? null;

  useMetaTags({
    title: product ? product.title : "Merchandise",
    description: product?.description,
  });

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-muted-foreground">Product not found.</p>
          <Link
            to="/store"
            className="text-primary hover:underline text-sm mt-2 inline-block"
          >
            ← Back to Store
          </Link>
        </div>
      </div>
    );
  }

  const alreadyInCart = items.some(
    (i) =>
      i.productId === product.id &&
      i.type === "merch" &&
      (!product.sizes?.length || i.selectedSize === selectedSize),
  );

  const razorpayLink =
    product.paymentLink?.trim() || RAZORPAY_MERCH_LINKS[product.title] || "#";

  const shipping = getShipping(
    product.shippingIndia,
    product.shippingInternational,
  );

  const handleAdd = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addToCart({
      type: "merch",
      title: product.title,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
      productId: product.id,
      selectedSize: selectedSize || undefined,
    });
    toast.success(`"${product.title}" added to cart`);
  };

  // Related products: prefer same category, exclude current
  const related = [
    ...merch.filter(
      (m) => m.id !== product.id && m.category === product.category,
    ),
    ...merch.filter(
      (m) => m.id !== product.id && m.category !== product.category,
    ),
  ].slice(0, 3);

  return (
    <div className="min-h-screen">
      <div className="relative py-16 px-6 cinematic-bg">
        <div className="absolute inset-0 vignette pointer-events-none" />
        <div className="relative max-w-5xl mx-auto">
          <Link
            to="/store"
            data-ocid="store.link"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl overflow-hidden aspect-square"
              style={{ boxShadow: "0 8px 60px rgba(0,0,0,0.5)" }}
            >
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <MerchPlaceholder category={product.category} />
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-5"
            >
              <div className="flex gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="border-primary/40 text-primary"
                >
                  {product.category}
                </Badge>
                {product.featured && (
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    Featured
                  </Badge>
                )}
                {!product.inStock && (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>

              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                {product.title}
              </h1>

              <StarRating
                productId={product.id}
                productType="merch"
                interactive
                size="sm"
              />

              <p className="text-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Price + shipping */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-4">
                  <span className="font-serif text-3xl font-bold text-primary">
                    {formatPrice(
                      product.priceINR,
                      product.priceUSD,
                      product.price,
                    )}
                  </span>
                  <Button
                    data-ocid="store.primary_button"
                    onClick={handleAdd}
                    disabled={!product.inStock}
                    className="gap-2 bg-primary text-primary-foreground hover:brightness-110"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>
                {shipping && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-primary shrink-0" />
                    {shipping.label}
                    {shipping.amount === 0 && (
                      <span className="text-green-400 text-xs font-semibold ml-1">
                        FREE
                      </span>
                    )}
                  </p>
                )}
                {!shipping && (
                  <p className="text-xs text-muted-foreground">
                    Shipping calculated at checkout
                  </p>
                )}
              </div>

              {/* Size selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      Select Size
                    </p>
                    {isClothing(product.category) && <SizeChartModal />}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => {
                      const outOfStock = product.stockBySize?.[size] === 0;
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          disabled={outOfStock}
                          onClick={() => !outOfStock && setSelectedSize(size)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                            outOfStock
                              ? "border-white/10 text-muted-foreground/40 line-through cursor-not-allowed"
                              : isSelected
                                ? "border-primary bg-primary/20 text-primary"
                                : "border-white/20 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                  {product.sizes.length > 0 && !selectedSize && (
                    <p className="text-xs text-muted-foreground">
                      Please select a size to continue
                    </p>
                  )}
                </div>
              )}

              {/* Razorpay Buy Now */}
              <div className="space-y-1.5">
                <a
                  href={razorpayLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto block"
                  data-ocid="store.secondary_button"
                >
                  <button
                    type="button"
                    disabled={!product.inStock}
                    className="w-full gap-2 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-lg shadow-amber-500/25 hover:shadow-amber-400/40 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <Zap className="w-4 h-4" />
                    Buy Now — Fast Checkout
                  </button>
                </a>
                <p className="text-xs text-muted-foreground">
                  Secure checkout via Razorpay · UPI, Cards, Net Banking
                </p>
              </div>

              {alreadyInCart && (
                <Link to="/store/cart" data-ocid="store.link">
                  <Button
                    variant="outline"
                    className="gap-2 border-primary/40 text-primary hover:bg-primary/10 w-full"
                  >
                    View Cart
                  </Button>
                </Link>
              )}

              <div className="glass rounded-xl p-4 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="w-4 h-4 text-primary" />
                  <span>
                    {shippingRegion === "india"
                      ? "Ships within India — 3–5 business days"
                      : "International shipping — 7–14 business days"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Free returns within 14 days.{" "}
                  <Link
                    to="/return-policy"
                    className="text-primary hover:underline"
                  >
                    View Return Policy
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 py-12">
          <h2 className="font-serif text-xl font-bold text-foreground mb-6">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {related.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl overflow-hidden border border-white/10 flex flex-col"
              >
                <div className="aspect-square bg-muted/20">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${
                        MERCH_GRADIENTS[item.category] ?? MERCH_GRADIENTS.Other
                      } flex items-center justify-center`}
                    >
                      <ShoppingCart className="w-8 h-8 text-primary/40" />
                    </div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col gap-2">
                  <p className="font-medium text-foreground text-sm line-clamp-2">
                    {item.title}
                  </p>
                  <p className="text-primary font-bold text-sm">
                    {formatPrice(item.priceINR, item.priceUSD, item.price)}
                  </p>
                  <Link
                    to="/store/merch/$id"
                    params={{ id: item.id }}
                    data-ocid="store.link"
                    className="mt-auto"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-primary/30 text-primary hover:bg-primary/10"
                    >
                      View
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
