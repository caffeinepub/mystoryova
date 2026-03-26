import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Headphones, Package, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useMetaTags } from "../hooks/useMetaTags";

export default function ThankYouPage() {
  useMetaTags({
    title: "Thank You for Your Purchase — Mystoryova",
    description:
      "Your purchase is confirmed. Your story continues with Mystoryova.",
  });

  return (
    <div className="min-h-screen cinematic-bg relative flex items-center justify-center px-6 py-20">
      <div className="absolute inset-0 vignette pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background/90" />

      <div className="relative max-w-2xl w-full mx-auto text-center space-y-10">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="flex justify-center"
        >
          <div className="relative">
            <CheckCircle2
              className="w-24 h-24 text-amber-400"
              strokeWidth={1.5}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 2.5,
                delay: 0.4,
              }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles className="w-6 h-6 text-amber-300" />
            </motion.div>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <p className="text-xs tracking-[0.4em] text-amber-400 font-semibold">
            MYSTORYOVA
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Thank You for Your Purchase!
          </h1>
          <p className="text-lg text-muted-foreground italic">
            Your story continues…
          </p>
        </motion.div>

        {/* Info cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div
            data-ocid="thankyou.card"
            className="glass rounded-2xl p-6 border border-amber-400/20 text-left space-y-3 hover:border-amber-400/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center border border-amber-400/20">
                <Headphones className="w-5 h-5 text-amber-400" />
              </div>
              <p className="font-semibold text-foreground text-sm">
                For Audiobooks
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Check your email for access. Your audiobook download link will
              arrive within a few minutes.
            </p>
            <p className="text-xs text-amber-400/70">
              📧 Look for an email from mystoryova@gmail.com
            </p>
          </div>

          <div
            data-ocid="thankyou.card"
            className="glass rounded-2xl p-6 border border-primary/20 text-left space-y-3 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <p className="font-semibold text-foreground text-sm">
                For Merchandise
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your order is being processed. You’ll receive a shipping
              confirmation email soon.
            </p>
            <p className="text-xs text-primary/70">
              🚚 Estimated delivery: 3–5 business days
            </p>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link to="/store" data-ocid="thankyou.primary_button">
            <Button className="gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-3 rounded-lg shadow-lg shadow-amber-500/25 hover:shadow-amber-400/40 hover:scale-105 transition-all duration-200 text-base">
              Continue Exploring →
            </Button>
          </Link>
          <Link
            to="/"
            data-ocid="thankyou.link"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
          >
            Return to Home
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="text-xs text-muted-foreground"
        >
          Questions? Contact us at{" "}
          <a
            href="mailto:mystoryova@gmail.com"
            className="text-primary hover:underline"
          >
            mystoryova@gmail.com
          </a>
        </motion.p>
      </div>
    </div>
  );
}
