import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Headphones,
  Mic,
  ShoppingCart,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import AudioPlayer from "../components/AudioPlayer";
import StarRating from "../components/StarRating";
import { RAZORPAY_AUDIOBOOK_LINKS } from "../config/razorpayLinks";
import { useCart } from "../hooks/useCart";
import { useMetaTags } from "../hooks/useMetaTags";
import { useStore } from "../hooks/useStore";

export default function AudiobookDetailPage() {
  const { id } = useParams({ from: "/store/audiobooks/$id" });
  const { audiobooks } = useStore();
  const { addToCart, items } = useCart();

  const ab = audiobooks.find((a) => a.id === id) ?? null;

  useMetaTags({
    title: ab ? `${ab.title} — Audiobook` : "Audiobook",
    description: ab?.description,
  });

  if (!ab) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <Skeleton className="h-64 w-44 rounded-2xl mx-auto mb-6" />
          <p className="text-muted-foreground">Audiobook not found.</p>
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

  const inCart = items.some(
    (i) => i.productId === ab.id && i.type === "audiobook",
  );

  const razorpayLink = RAZORPAY_AUDIOBOOK_LINKS[ab.title] ?? "#";

  const handleBuy = () => {
    if (inCart) return;
    addToCart({
      type: "audiobook",
      title: ab.title,
      price: ab.price,
      quantity: 1,
      imageUrl: ab.coverUrl,
      productId: ab.id,
    });
    toast.success(`"${ab.title}" added to cart`);
  };

  // Other audiobooks for the "More Audiobooks" section
  const others = audiobooks.filter((a) => a.id !== ab.id).slice(0, 3);

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
            {/* Cover */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-center"
            >
              <div
                className="w-64 h-80 rounded-2xl overflow-hidden shadow-cinematic"
                style={{
                  transform: "perspective(600px) rotateY(-6deg)",
                  boxShadow:
                    "0 0 40px rgba(201,169,110,0.2), 0 8px 60px rgba(0,0,0,0.6)",
                }}
              >
                {ab.coverUrl ? (
                  <img
                    src={ab.coverUrl}
                    alt={ab.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/70 flex items-center justify-center">
                    <Headphones className="w-16 h-16 text-primary/60" />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-5"
            >
              <Badge className="bg-primary/20 text-primary border-primary/30">
                <Headphones className="w-3 h-3 mr-1" /> Audiobook
              </Badge>

              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                {ab.title}
              </h1>

              <StarRating
                productId={ab.id}
                productType="audiobook"
                interactive
                size="sm"
              />

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-primary" /> {ab.narrator}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" /> {ab.duration}
                </span>
              </div>
              <p className="text-foreground leading-relaxed">
                {ab.description}
              </p>
              <div className="flex items-center gap-4 pt-2">
                <span className="font-serif text-3xl font-bold text-primary">
                  ₹{(ab.price / 100).toFixed(2)}
                </span>
                <Button
                  data-ocid="store.primary_button"
                  onClick={handleBuy}
                  disabled={inCart}
                  className="gap-2 bg-primary text-primary-foreground hover:brightness-110"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {inCart ? "In Cart" : "Buy Audiobook"}
                </Button>
              </div>

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
                    className="w-full gap-2 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-lg shadow-amber-500/25 hover:shadow-amber-400/40 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Buy Now — Instant Access
                  </button>
                </a>
                <p className="text-xs text-muted-foreground">
                  Secure checkout via Razorpay · UPI, Cards, Net Banking
                </p>
              </div>

              {inCart && (
                <Link to="/store/cart" data-ocid="store.link">
                  <Button
                    variant="outline"
                    className="gap-2 border-primary/40 text-primary hover:bg-primary/10 w-full"
                  >
                    View Cart & Checkout
                  </Button>
                </Link>
              )}

              {/* Bundle callout */}
              <div className="glass rounded-xl p-4 border-l-4 border-primary bg-primary/5">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-foreground font-medium">
                      📚 Also available as a book
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Browse our full book collection.{" "}
                      <Link
                        to="/books"
                        className="text-primary hover:underline"
                        data-ocid="store.link"
                      >
                        View Books →
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Already purchased?{" "}
                <Link
                  to="/store/library"
                  className="text-primary hover:underline"
                >
                  Access your library
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Sample player */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h2 className="font-serif text-xl font-bold text-foreground mb-5">
          Listen to a Sample
        </h2>
        <AudioPlayer
          src={ab.sampleUrl}
          title={`Sample — ${ab.title}`}
          audiobookId={ab.id}
        />
      </div>

      {/* More audiobooks */}
      {others.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 pb-16">
          <h2 className="font-serif text-xl font-bold text-foreground mb-6">
            More Audiobooks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {others.map((other, i) => (
              <motion.div
                key={other.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl overflow-hidden border border-white/10 flex flex-col"
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-secondary/60 flex items-center justify-center">
                  {other.coverUrl ? (
                    <img
                      src={other.coverUrl}
                      alt={other.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Headphones className="w-10 h-10 text-primary/50" />
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col gap-2">
                  <p className="font-medium text-foreground text-sm line-clamp-2">
                    {other.title}
                  </p>
                  <p className="text-primary font-bold text-sm">
                    ₹{(other.price / 100).toFixed(2)}
                  </p>
                  <Link
                    to="/store/audiobooks/$id"
                    params={{ id: other.id }}
                    data-ocid="store.link"
                    className="mt-auto"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-primary/30 text-primary hover:bg-primary/10"
                    >
                      Listen
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
