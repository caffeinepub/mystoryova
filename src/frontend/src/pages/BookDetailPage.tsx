import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Loader2, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import BookCard, { getBookCover } from "../components/BookCard";
import ScrollReveal from "../components/ScrollReveal";
import { useMetaTags } from "../hooks/useMetaTags";
import {
  useAddReview,
  useGetBook,
  useGetRelatedBooks,
  useGetReviewsForBook,
} from "../hooks/useQueries";

const STAR_INDICES = [0, 1, 2, 3, 4];

export default function BookDetailPage() {
  const { id } = useParams({ from: "/books/$id" });
  const { data: book, isLoading } = useGetBook(id);
  const { data: relatedBooks = [] } = useGetRelatedBooks(id);
  const { data: reviews = [] } = useGetReviewsForBook(id);
  const addReview = useAddReview();

  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  useMetaTags({ title: book?.title, description: book?.description });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;
    addReview.mutate(
      {
        id: BigInt(0),
        bookId: book.id,
        reviewerName,
        rating: BigInt(rating),
        reviewText,
        reviewDate: new Date().toISOString().split("T")[0],
      },
      {
        onSuccess: () => {
          toast.success("Review submitted!");
          setReviewerName("");
          setReviewText("");
          setRating(5);
        },
        onError: () => toast.error("Failed to submit review."),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Skeleton className="h-96 rounded-2xl mb-8" />
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
      </div>
    );
  }

  if (!book)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Book not found.</p>
      </div>
    );

  const cover = getBookCover(book);
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
      : 0;

  return (
    <div className="min-h-screen">
      <div className="relative py-12 px-6 cinematic-bg">
        <div className="absolute inset-0 vignette pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <Link
            to="/books"
            data-ocid="book.link"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Books
          </Link>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="flex justify-center">
              <div
                className="w-64 h-96 rounded-2xl overflow-hidden shadow-cinematic"
                style={{
                  transform: "perspective(600px) rotateY(-8deg)",
                  boxShadow:
                    "0 0 40px rgba(201,169,110,0.25), 0 8px 60px rgba(0,0,0,0.6)",
                }}
              >
                {cover ? (
                  <img
                    src={cover}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/50 flex items-center justify-center">
                    <span className="font-serif text-5xl font-bold text-primary">
                      {book.title[0]}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {book.genres.map((g) => (
                  <Badge key={g} variant="secondary">
                    {g}
                  </Badge>
                ))}
              </div>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-2">
                {book.title}
              </h1>
              {book.subtitle && (
                <p className="text-muted-foreground text-lg mb-4">
                  {book.subtitle}
                </p>
              )}
              {reviews.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {STAR_INDICES.map((n) => (
                      <Star
                        key={n}
                        className={`w-4 h-4 ${n < Math.round(avgRating) ? "fill-primary text-primary" : "text-muted-foreground/40"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({reviews.length} reviews)
                  </span>
                </div>
              )}
              <p className="text-foreground leading-relaxed mb-6">
                {book.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {book.formats.map((f) => (
                  <Badge
                    key={f}
                    variant="outline"
                    className="border-primary/40 text-primary"
                  >
                    {f}
                  </Badge>
                ))}
              </div>
              {book.amazonLink && (
                <a
                  href={book.amazonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    data-ocid="book.primary_button"
                    className="bg-primary text-primary-foreground hover:brightness-110"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" /> Buy on Amazon
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        {book.lookInsideText && (
          <ScrollReveal>
            <section>
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  Look Inside
                </h2>
              </div>
              <div className="glass rounded-2xl p-8 border-l-4 border-primary">
                <p className="text-foreground leading-loose font-serif italic text-lg">
                  {book.lookInsideText}
                </p>
              </div>
            </section>
          </ScrollReveal>
        )}
        {book.authorNotes && (
          <ScrollReveal>
            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                Author's Notes
              </h2>
              <div className="glass rounded-2xl p-8">
                <p className="text-muted-foreground leading-relaxed">
                  {book.authorNotes}
                </p>
              </div>
            </section>
          </ScrollReveal>
        )}
        <ScrollReveal>
          <section data-ocid="reviews.section">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-8">
              Reader Reviews
            </h2>
            {reviews.length === 0 ? (
              <div
                data-ocid="reviews.empty_state"
                className="glass rounded-2xl p-8 text-center"
              >
                <p className="text-muted-foreground">
                  Be the first to leave a review.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 mb-8">
                {reviews.map((r, i) => (
                  <div
                    key={String(r.id)}
                    data-ocid={`reviews.item.${i + 1}`}
                    className="glass rounded-2xl p-6"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-foreground text-sm">
                        {r.reviewerName}
                      </span>
                      <div className="flex gap-0.5">
                        {STAR_INDICES.map((n) => (
                          <Star
                            key={n}
                            className={`w-3.5 h-3.5 ${n < Number(r.rating) ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {r.reviewText}
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-3">
                      {r.reviewDate}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div className="glass rounded-2xl p-8">
              <h3 className="font-serif text-xl font-bold text-foreground mb-6">
                Write a Review
              </h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="reviewer-name">Your Name</Label>
                  <Input
                    data-ocid="reviews.input"
                    id="reviewer-name"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    required
                    className="mt-1 bg-muted/30 border-white/10"
                  />
                </div>
                <div>
                  <Label>Rating</Label>
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${s <= rating ? "fill-primary text-primary" : "text-muted-foreground/40"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="review-text">Your Review</Label>
                  <Textarea
                    data-ocid="reviews.textarea"
                    id="review-text"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                    rows={4}
                    className="mt-1 bg-muted/30 border-white/10"
                  />
                </div>
                <Button
                  data-ocid="reviews.submit_button"
                  type="submit"
                  disabled={addReview.isPending}
                  className="bg-primary text-primary-foreground hover:brightness-110"
                >
                  {addReview.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </form>
            </div>
          </section>
        </ScrollReveal>
        {relatedBooks.length > 0 && (
          <ScrollReveal>
            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-8">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedBooks.map((rb, i) => (
                  <BookCard key={String(rb.id)} book={rb} index={i + 1} />
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}
