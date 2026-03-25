import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { BookOpen, ChevronLeft, ChevronRight, Mail, Star } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import Book3D from "../components/Book3D";
import BookCard from "../components/BookCard";
import ScrollReveal from "../components/ScrollReveal";
import { useMetaTags } from "../hooks/useMetaTags";
import {
  useGetAllBooks,
  useSeedInitialData,
  useSubscribeNewsletter,
} from "../hooks/useQueries";

const QUOTES = [
  {
    text: "She didn't fear the dark. She feared what it revealed about the light she had chosen to believe in.",
    source: "The Echo Chamber",
  },
  {
    text: "Memory is not a record. It is a wound that heals in the shape of whoever we need to become.",
    source: "The Weight of Remembering",
  },
  {
    text: "Some silences carry more truth than any confession. The space between words is where we actually live.",
    source: "The Silence Between",
  },
];

const TESTIMONIALS = [
  {
    text: "O. Chiddarwar writes with a scalpel. Every sentence strips away another layer of comfortable illusion. 'The Echo Chamber' is the most unsettling book I've read in years — and also the most healing.",
    name: "Priya M.",
    label: "Goodreads Reviewer",
    rating: 5,
  },
  {
    text: "There is a rare courage in this writing. Chiddarwar does not flinch. The exploration of grief in 'The Weight of Remembering' left me changed.",
    name: "James K.",
    label: "BookClub Member",
    rating: 5,
  },
  {
    text: "I picked up 'Fractured Mirrors' on a whim and didn't surface for two days. The psychological depth is extraordinary.",
    name: "Aisha R.",
    label: "Verified Reviewer",
    rating: 5,
  },
  {
    text: "Literary fiction that actually matters. Chiddarwar understands the human condition with terrifying precision.",
    name: "Thomas B.",
    label: "Amazon Reviewer",
    rating: 5,
  },
];

const STAR_INDICES = [0, 1, 2, 3, 4];

export default function HomePage() {
  useMetaTags({ title: "Home" });
  const { data: books = [], isLoading } = useGetAllBooks();
  const subscribeMutation = useSubscribeNewsletter();
  const seedMutation = useSeedInitialData();
  const [email, setEmail] = useState("");
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount
  useEffect(() => {
    if (!localStorage.getItem("seeded")) {
      seedMutation.mutate(undefined, {
        onSuccess: () => localStorage.setItem("seeded", "true"),
      });
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(
      () => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length),
      5000,
    );
    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribeMutation.mutate(email, {
      onSuccess: () => {
        toast.success("You're on the list.");
        setEmail("");
      },
      onError: () => toast.error("Something went wrong."),
    });
  };

  const featuredBooks = books.slice(0, 3);

  return (
    <div className="overflow-hidden">
      <section
        className="relative min-h-[90vh] flex items-center"
        data-ocid="hero.section"
      >
        <div className="absolute inset-0 cinematic-bg" />
        <div className="absolute inset-0 vignette pointer-events-none" />
        <div className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="flex justify-center">
            <div
              className="w-56 h-80 md:w-72 md:h-96 animate-float gold-glow rounded-xl overflow-hidden glass"
              aria-hidden="true"
            >
              <Suspense
                fallback={
                  <div className="w-full h-full bg-primary/20 animate-pulse rounded-xl" />
                }
              >
                <Book3D />
              </Suspense>
            </div>
          </div>
          <div className="text-center md:text-left">
            <Badge
              variant="outline"
              className="border-primary/50 text-primary text-xs tracking-widest mb-6"
            >
              PSYCHOLOGICAL FICTION
            </Badge>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
              Stories That Haunt.
              <br />
              <span className="text-gradient-gold">Truths That Heal.</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
              O. Chiddarwar explores the labyrinth of the human mind — where
              memory fractures, love distorts, and healing begins in the most
              unexpected places.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/books">
                <Button
                  data-ocid="hero.primary_button"
                  size="lg"
                  className="bg-primary text-primary-foreground hover:brightness-110 px-8 font-semibold tracking-wide"
                >
                  <BookOpen className="w-5 h-5 mr-2" /> Explore the Collection
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  data-ocid="hero.secondary_button"
                  size="lg"
                  variant="outline"
                  className="border-foreground/30 hover:bg-foreground/5 px-8"
                >
                  About the Author
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6" data-ocid="books.section">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] text-primary mb-3">
              THE COLLECTION
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground">
              Featured Works
            </h2>
          </ScrollReveal>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-96 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              data-ocid="books.list"
            >
              {featuredBooks.map((book, i) => (
                <ScrollReveal key={String(book.id)} delay={i * 150}>
                  <BookCard book={book} index={i + 1} />
                </ScrollReveal>
              ))}
            </div>
          )}
          <ScrollReveal className="text-center mt-12">
            <Link to="/books">
              <Button
                data-ocid="books.primary_button"
                variant="outline"
                size="lg"
                className="border-primary/50 text-primary hover:bg-primary/10 tracking-widest text-xs"
              >
                VIEW ALL BOOKS
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-24 px-6 relative" data-ocid="quotes.section">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] text-primary mb-3">
              WORDS FROM THE PAGES
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground">
              Passages
            </h2>
          </ScrollReveal>
          <div className="flex flex-col gap-12">
            {QUOTES.map((q) => (
              <ScrollReveal key={q.source}>
                <blockquote className="glass rounded-2xl p-8 md:p-12 relative">
                  <span
                    className="absolute top-4 left-8 font-serif text-8xl text-primary/20 leading-none select-none"
                    aria-hidden="true"
                  >
                    “
                  </span>
                  <p className="font-serif text-xl md:text-2xl text-foreground leading-relaxed italic pl-8 relative z-10">
                    {q.text}
                  </p>
                  <footer className="mt-6 pl-8">
                    <cite className="text-xs tracking-widest text-primary not-italic">
                      — {q.source}
                    </cite>
                  </footer>
                </blockquote>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6" data-ocid="testimonials.section">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] text-primary mb-3">
              READER VOICES
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground">
              What Readers Say
            </h2>
          </ScrollReveal>
          <div className="relative">
            <div className="glass rounded-2xl p-8 md:p-12 min-h-48">
              <div className="flex gap-1 mb-6">
                {STAR_INDICES.map((n) => (
                  <Star
                    key={n}
                    className={`w-4 h-4 ${n < TESTIMONIALS[testimonialIdx].rating ? "fill-primary text-primary" : "text-muted-foreground/40"}`}
                  />
                ))}
              </div>
              <blockquote className="font-serif text-lg md:text-xl text-foreground leading-relaxed italic mb-6">
                "{TESTIMONIALS[testimonialIdx].text}"
              </blockquote>
              <div>
                <p className="font-semibold text-foreground text-sm">
                  {TESTIMONIALS[testimonialIdx].name}
                </p>
                <p className="text-muted-foreground text-xs tracking-widest">
                  {TESTIMONIALS[testimonialIdx].label}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                type="button"
                data-ocid="testimonials.pagination_prev"
                onClick={() =>
                  setTestimonialIdx(
                    (i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length,
                  )
                }
                className="p-2 rounded-full glass hover:text-primary transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {TESTIMONIALS.map((t) => (
                  <button
                    type="button"
                    key={t.name}
                    onClick={() => setTestimonialIdx(TESTIMONIALS.indexOf(t))}
                    className={`h-2 rounded-full transition-all ${TESTIMONIALS.indexOf(t) === testimonialIdx ? "bg-primary w-6" : "bg-muted-foreground/40 w-2"}`}
                    aria-label={`Go to testimonial by ${t.name}`}
                  />
                ))}
              </div>
              <button
                type="button"
                data-ocid="testimonials.pagination_next"
                onClick={() =>
                  setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length)
                }
                className="p-2 rounded-full glass hover:text-primary transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6" data-ocid="newsletter.section">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal className="glass rounded-2xl p-10 md:p-14 text-center">
            <Mail className="w-10 h-10 text-primary mx-auto mb-6" />
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              Stay in the Story
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Join the inner circle. Receive exclusive excerpts, writing notes,
              and first access to new releases.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Input
                data-ocid="newsletter.input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 bg-muted/50 border-white/15 h-12"
              />
              <Button
                data-ocid="newsletter.submit_button"
                type="submit"
                disabled={subscribeMutation.isPending}
                className="h-12 px-8 bg-primary text-primary-foreground hover:brightness-110 font-semibold"
              >
                {subscribeMutation.isPending ? "Joining..." : "Join the Circle"}
              </Button>
            </form>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
