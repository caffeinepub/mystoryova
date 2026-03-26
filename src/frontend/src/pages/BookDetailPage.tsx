import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Headphones,
  MessageSquare,
  Mic,
  Star,
  Tablet,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AudioPlayer from "../components/AudioPlayer";
import BookCard, { getBookCover } from "../components/BookCard";
import ScrollReveal from "../components/ScrollReveal";
import { useMetaTags } from "../hooks/useMetaTags";
import {
  useAddReview,
  useGetBook,
  useGetRelatedBooks,
  useGetReviewsForBook,
} from "../hooks/useQueries";
import { useStore } from "../hooks/useStore";

function StarRating({
  value,
  onChange,
}: { value: number; onChange?: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={
            onChange
              ? "cursor-pointer transition-transform hover:scale-110"
              : "cursor-default"
          }
          tabIndex={onChange ? 0 : -1}
        >
          <Star
            className="w-5 h-5"
            fill={(hovered || value) >= star ? "#c9a96e" : "none"}
            stroke={(hovered || value) >= star ? "#c9a96e" : "#6b7280"}
          />
        </button>
      ))}
    </div>
  );
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function BookDetailPage() {
  const { id } = useParams({ from: "/books/$id" });
  const { data: book, isLoading } = useGetBook(id);
  const { data: relatedBooks = [] } = useGetRelatedBooks(id);
  const { data: reviews = [], isLoading: reviewsLoading } =
    useGetReviewsForBook(id);
  const addReview = useAddReview();
  const { audiobooks } = useStore();

  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  useMetaTags({ title: book?.title, description: book?.description });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;
    if (!reviewerName.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please write your review.");
      return;
    }
    try {
      await addReview.mutateAsync({
        id: BigInt(0),
        bookId: book.id,
        reviewerName: reviewerName.trim(),
        reviewText: reviewText.trim(),
        rating: BigInt(rating),
        reviewDate: new Date().toISOString().split("T")[0],
      });
      toast.success("Thank you for your review!");
      setReviewerName("");
      setRating(0);
      setReviewText("");
    } catch {
      toast.error("Failed to submit review. Please try again.");
    }
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
  const sortedReviews = [...reviews].sort((a, b) =>
    b.reviewDate.localeCompare(a.reviewDate),
  );

  // Find audiobook linked to this book
  const linkedAudiobook = audiobooks.find(
    (ab) => ab.bookId === String(book.id),
  );

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
                      {book.title[0] ?? "?"}
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
              <div className="flex flex-wrap gap-3">
                {book.amazonEbookLink && (
                  <a
                    href={book.amazonEbookLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      data-ocid="book.primary_button"
                      className="gap-2 bg-primary text-primary-foreground hover:brightness-110"
                    >
                      <Tablet className="w-4 h-4" /> Kindle / eBook
                    </Button>
                  </a>
                )}
                {book.amazonPaperbackLink && (
                  <a
                    href={book.amazonPaperbackLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      data-ocid="book.secondary_button"
                      variant="outline"
                      className="gap-2 border-primary/50 text-primary hover:bg-primary/10"
                    >
                      <BookOpen className="w-4 h-4" /> Paperback
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        {/* Audiobook Section */}
        {linkedAudiobook && (
          <ScrollReveal>
            <section
              className="glass rounded-2xl p-8 border border-primary/20"
              data-ocid="book.panel"
            >
              <div className="flex items-center gap-3 mb-6">
                <Headphones className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  Available as Audiobook
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Mic className="w-4 h-4 text-primary" />
                      {linkedAudiobook.narrator}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-primary" />
                      {linkedAudiobook.duration}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {linkedAudiobook.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-2xl font-bold text-primary">
                      ${(linkedAudiobook.price / 100).toFixed(2)}
                    </span>
                    <Link
                      to="/store/audiobooks/$id"
                      params={{ id: linkedAudiobook.id }}
                    >
                      <Button
                        data-ocid="book.primary_button"
                        className="gap-2 bg-primary text-primary-foreground hover:brightness-110"
                      >
                        <Headphones className="w-4 h-4" /> Buy Audiobook
                      </Button>
                    </Link>
                  </div>
                </div>
                {linkedAudiobook.sampleUrl && (
                  <AudioPlayer
                    src={linkedAudiobook.sampleUrl}
                    title={`Sample — ${linkedAudiobook.title}`}
                  />
                )}
              </div>
            </section>
          </ScrollReveal>
        )}

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

        {/* Reader Reviews Section */}
        <ScrollReveal>
          <section data-ocid="reviews.section">
            <div className="flex items-center gap-3 mb-8">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Reader Reviews
              </h2>
              {reviews.length > 0 && (
                <span className="text-sm text-muted-foreground ml-1">
                  ({reviews.length})
                </span>
              )}
            </div>

            {/* Submit Review Form */}
            <div className="glass rounded-2xl p-6 border border-white/10 mb-8">
              <h3 className="font-serif text-lg font-semibold text-foreground mb-5">
                Share Your Thoughts
              </h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label
                    htmlFor="review-name"
                    className="text-sm text-muted-foreground mb-1.5 block"
                  >
                    Your Name
                  </label>
                  <Input
                    id="review-name"
                    data-ocid="reviews.input"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="Enter your name"
                    className="bg-muted/30 border-white/10 focus:border-primary/60"
                  />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1.5">Rating</p>
                  <StarRating value={rating} onChange={setRating} />
                </div>
                <div>
                  <label
                    htmlFor="review-text"
                    className="text-sm text-muted-foreground mb-1.5 block"
                  >
                    Your Review
                  </label>
                  <Textarea
                    id="review-text"
                    data-ocid="reviews.textarea"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="What did you think of this book?"
                    rows={4}
                    className="bg-muted/30 border-white/10 focus:border-primary/60 resize-none"
                  />
                </div>
                <Button
                  data-ocid="reviews.submit_button"
                  type="submit"
                  disabled={addReview.isPending}
                  className="bg-primary text-primary-foreground hover:brightness-110"
                >
                  {addReview.isPending
                    ? "Submitting..."
                    : "Share Your Thoughts"}
                </Button>
              </form>
            </div>

            {/* Reviews List */}
            {reviewsLoading ? (
              <div className="space-y-4" data-ocid="reviews.loading_state">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-32 rounded-2xl" />
                ))}
              </div>
            ) : sortedReviews.length === 0 ? (
              <div
                data-ocid="reviews.empty_state"
                className="glass rounded-2xl p-10 border border-white/10 text-center"
              >
                <Star className="w-10 h-10 text-primary/40 mx-auto mb-3" />
                <p className="text-muted-foreground font-serif italic text-lg">
                  Be the first to share your thoughts on this book.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedReviews.map((review, i) => (
                  <div
                    key={String(review.id)}
                    data-ocid={`reviews.item.${i + 1}`}
                    className="glass rounded-2xl p-6 border border-white/10"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <p className="font-semibold text-foreground">
                          {review.reviewerName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(review.reviewDate)}
                        </p>
                      </div>
                      <StarRating value={Number(review.rating)} />
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {review.reviewText}
                    </p>
                  </div>
                ))}
              </div>
            )}
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
