import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ShoppingCart, Truck } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useCart } from "../hooks/useCart";
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

export default function MerchDetailPage() {
  const { id } = useParams({ from: "/store/merch/$id" });
  const { merch } = useStore();
  const { addToCart, items } = useCart();

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
    (i) => i.productId === product.id && i.type === "merch",
  );

  const handleAdd = () => {
    addToCart({
      type: "merch",
      title: product.title,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
      productId: product.id,
    });
    toast.success(`"${product.title}" added to cart`);
  };

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
              <p className="text-foreground leading-relaxed">
                {product.description}
              </p>
              <div className="flex items-center gap-4 pt-2">
                <span className="font-serif text-3xl font-bold text-primary">
                  ${(product.price / 100).toFixed(2)}
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
                  <span>Ships within 3–5 business days</span>
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
    </div>
  );
}
