import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { BookOpen, ChevronDown, Mail } from "lucide-react";
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

export default function HomePage() {
  useMetaTags({ title: "Home" });
  const { data: books = [], isLoading } = useGetAllBooks();
  const subscribeMutation = useSubscribeNewsletter();
  const seedMutation = useSeedInitialData();
  const [email, setEmail] = useState("");

  // biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount
  useEffect(() => {
    if (!localStorage.getItem("seededV2")) {
      seedMutation.mutate(undefined, {
        onSuccess: () => localStorage.setItem("seededV2", "true"),
      });
    }
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
        <div className="absolute right-1/4 bottom-1/3 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
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
              MYSTORYOVA
            </Badge>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground leading-tight mb-4 hero-text-shadow">
              Stories That Haunt.
              <br />
              <span className="text-gradient-gold">Truths That Heal.</span>
            </h1>
            <div className="section-divider my-6 max-w-xs" />
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
                  className="bg-primary text-primary-foreground hover:brightness-110 px-10 py-3 font-semibold tracking-wide hover:shadow-[0_0_20px_rgba(201,169,110,0.4)] transition-shadow"
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
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-primary/60 pointer-events-none">
          <ChevronDown className="w-6 h-6" />
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

      <section className="py-24 px-6" data-ocid="newsletter.section">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal className="glass rounded-2xl p-10 md:p-14 text-center">
            <Mail className="w-10 h-10 text-primary mx-auto mb-6" />
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              Stay in the Story
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Join the inner circle. Receive exclusive writing notes and first
              access to new releases.
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
