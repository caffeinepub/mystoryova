import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import { Headphones, ShoppingBag, ShoppingCart, Star, Zap } from "lucide-react";
import { motion } from "motion/react";
import {
  RAZORPAY_AUDIOBOOK_LINKS,
  RAZORPAY_MERCH_LINKS,
} from "../config/razorpayLinks";
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
  const gradient = MERCH_GRADIENTS[category] ?? MERCH_GRADIENTS.Other;
  return (
    <div
      className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
    >
      <ShoppingBag className="w-12 h-12 text-primary/50" />
    </div>
  );
}

function AudioCover({ coverUrl, title }: { coverUrl: string; title: string }) {
  if (coverUrl) {
    return (
      <img src={coverUrl} alt={title} className="w-full h-full object-cover" />
    );
  }
  return (
    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/60 flex items-center justify-center">
      <Headphones className="w-12 h-12 text-primary/50" />
    </div>
  );
}

export default function StorePage() {
  useMetaTags({
    title: "Mystoryova Store",
    description: "Own the stories you love. Audiobooks and author merchandise.",
  });
  const { merch, audiobooks } = useStore();
  const { cartCount } = useCart();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 px-6 cinematic-bg overflow-hidden">
        <div className="absolute inset-0 vignette pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs tracking-[0.4em] text-primary font-semibold mb-4"
          >
            MYSTORYOVA
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl md:text-7xl font-bold text-foreground mb-4"
          >
            The Store
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground mb-8"
          >
            Own the Stories You Love
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex gap-4 justify-center"
          >
            <Link to="/store/cart" data-ocid="store.link">
              <Button
                variant="outline"
                className="gap-2 border-primary/50 text-primary hover:bg-primary/10"
              >
                <ShoppingCart className="w-4 h-4" />
                Cart {cartCount > 0 ? `(${cartCount})` : ""}
              </Button>
            </Link>
            <Link to="/store/library" data-ocid="store.link">
              <Button
                variant="ghost"
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <Headphones className="w-4 h-4" /> My Library
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <Tabs defaultValue="audiobooks">
          <TabsList
            className="mb-10 glass border border-white/10"
            data-ocid="store.tab"
          >
            <TabsTrigger value="audiobooks" data-ocid="store.tab">
              <Headphones className="w-4 h-4 mr-2" /> Audiobooks
            </TabsTrigger>
            <TabsTrigger value="merch" data-ocid="store.tab">
              <ShoppingBag className="w-4 h-4 mr-2" /> Merchandise
            </TabsTrigger>
          </TabsList>

          {/* Audiobooks Tab */}
          <TabsContent value="audiobooks">
            {audiobooks.length === 0 ? (
              <div
                data-ocid="store.empty_state"
                className="text-center py-20 text-muted-foreground"
              >
                <Headphones className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No audiobooks available yet. Check back soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {audiobooks.map((ab, idx) => {
                  const razorpayLink =
                    RAZORPAY_AUDIOBOOK_LINKS[ab.title] ?? "#";
                  return (
                    <motion.div
                      key={ab.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.07 }}
                      data-ocid={`store.item.${idx + 1}`}
                      className="glass rounded-2xl overflow-hidden border border-white/10 hover:border-primary/30 transition-all group"
                    >
                      <div className="relative h-56 overflow-hidden">
                        <AudioCover coverUrl={ab.coverUrl} title={ab.title} />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                        <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs">
                          <Headphones className="w-3 h-3 mr-1" /> Audiobook
                        </Badge>
                      </div>
                      <div className="p-5 space-y-3">
                        <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                          {ab.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Narrated by {ab.narrator} · {ab.duration}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {ab.description}
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-primary font-bold text-lg">
                            ₹{(ab.price / 100).toFixed(2)}
                          </span>
                          <div className="flex gap-2">
                            {ab.sampleUrl && (
                              <Link
                                to="/store/audiobooks/$id"
                                params={{ id: ab.id }}
                                data-ocid="store.secondary_button"
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-primary/30 text-primary hover:bg-primary/10 text-xs"
                                >
                                  Preview
                                </Button>
                              </Link>
                            )}
                            <a
                              href={razorpayLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-ocid="store.primary_button"
                            >
                              <button
                                type="button"
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 hover:shadow-amber-400/30 hover:scale-105 transition-all duration-200"
                              >
                                <Zap className="w-3 h-3" /> Buy Now
                              </button>
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Merch Tab */}
          <TabsContent value="merch">
            {merch.length === 0 ? (
              <div
                data-ocid="store.empty_state"
                className="text-center py-20 text-muted-foreground"
              >
                <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No merchandise available yet. Check back soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {merch.map((product, idx) => {
                  const razorpayLink =
                    RAZORPAY_MERCH_LINKS[product.title] ?? "#";
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      data-ocid={`store.item.${idx + 1}`}
                      className="glass rounded-2xl overflow-hidden border border-white/10 hover:border-primary/30 transition-all group"
                    >
                      <div className="relative h-52 overflow-hidden">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <MerchPlaceholder category={product.category} />
                        )}
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Badge variant="secondary">Out of Stock</Badge>
                          </div>
                        )}
                        <Badge className="absolute top-3 left-3 bg-black/70 text-foreground text-xs border border-white/10">
                          {product.category}
                        </Badge>
                        {product.featured && (
                          <Badge className="absolute top-3 right-3 bg-primary/90 text-primary-foreground text-xs">
                            <Star className="w-3 h-3 mr-1" /> Featured
                          </Badge>
                        )}
                      </div>
                      <div className="p-4 space-y-3">
                        <Link to="/store/merch/$id" params={{ id: product.id }}>
                          <h3 className="font-serif font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {product.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-primary font-bold">
                            ₹{(product.price / 100).toFixed(2)}
                          </span>
                          <a
                            href={razorpayLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-ocid="store.primary_button"
                          >
                            <button
                              type="button"
                              disabled={!product.inStock}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 hover:shadow-amber-400/30 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                              <Zap className="w-3 h-3" /> Buy Now
                            </button>
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
