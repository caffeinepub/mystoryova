import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Headphones, Library, Lock } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import AudioPlayer from "../components/AudioPlayer";
import { useMetaTags } from "../hooks/useMetaTags";
import { useStore } from "../hooks/useStore";

export default function MyLibraryPage() {
  useMetaTags({
    title: "My Audiobook Library — Mystoryova",
    description: "Access your purchased audiobooks.",
  });
  const { getPurchasedAudiobooks } = useStore();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setSubmitted(true);
  };

  const purchasedBooks = submitted ? getPurchasedAudiobooks(email.trim()) : [];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 px-6 cinematic-bg">
        <div className="absolute inset-0 vignette pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.4em] text-primary font-semibold mb-3">
            MYSTORYOVA
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3">
            My Library
          </h1>
          <p className="text-muted-foreground">
            Access your purchased audiobooks here.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-16 space-y-10">
        {/* Email gate */}
        <div
          className="glass rounded-2xl p-8 border border-white/10"
          data-ocid="library.card"
        >
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-xl font-bold text-foreground">
              Find Your Audiobooks
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label
                htmlFor="library-email"
                className="text-sm text-muted-foreground"
              >
                Email used at checkout
              </Label>
              <Input
                id="library-email"
                data-ocid="library.input"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSubmitted(false);
                }}
                placeholder="you@example.com"
                required
                className="mt-1 bg-muted/30 border-white/10"
              />
            </div>
            <Button
              type="submit"
              data-ocid="library.submit_button"
              className="bg-primary text-primary-foreground hover:brightness-110 gap-2"
            >
              <Library className="w-4 h-4" /> View My Library
            </Button>
          </form>
        </div>

        {/* Results */}
        {submitted && (
          <div>
            {purchasedBooks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 space-y-4"
                data-ocid="library.empty_state"
              >
                <Headphones className="w-12 h-12 text-primary/30 mx-auto" />
                <p className="text-muted-foreground font-serif italic">
                  No purchased audiobooks found for{" "}
                  <span className="font-mono text-foreground text-sm">
                    {email}
                  </span>
                  .
                </p>
                <p className="text-xs text-muted-foreground">
                  Make sure you're using the same email as when you checked out.
                </p>
                <a
                  href="/store"
                  className="text-primary hover:underline text-sm"
                >
                  Browse audiobooks →
                </a>
              </motion.div>
            ) : (
              <div className="space-y-6" data-ocid="library.list">
                <h2 className="font-serif text-xl font-bold text-foreground">
                  Your Audiobooks ({purchasedBooks.length})
                </h2>
                {purchasedBooks.map((ab, idx) => (
                  <motion.div
                    key={ab.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    data-ocid={`library.item.${idx + 1}`}
                    className="glass rounded-2xl p-6 border border-white/10 space-y-5"
                  >
                    <div className="flex gap-4 items-start">
                      <div className="w-16 h-20 rounded-xl overflow-hidden shrink-0 bg-muted/30">
                        {ab.coverUrl ? (
                          <img
                            src={ab.coverUrl}
                            alt={ab.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Headphones className="w-7 h-7 text-primary/40" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif font-bold text-lg text-foreground">
                          {ab.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Narrated by {ab.narrator} · {ab.duration}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        data-ocid={`library.toggle.${idx + 1}`}
                        onClick={() =>
                          setPlaying(playing === ab.id ? null : ab.id)
                        }
                        className="gap-1.5 bg-primary text-primary-foreground hover:brightness-110 shrink-0"
                      >
                        <Headphones className="w-3.5 h-3.5" />
                        {playing === ab.id ? "Close" : "Listen"}
                      </Button>
                    </div>

                    {playing === ab.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <AudioPlayer
                          src={ab.fullAudioUrl}
                          title={ab.title}
                          allowDownload={true}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
