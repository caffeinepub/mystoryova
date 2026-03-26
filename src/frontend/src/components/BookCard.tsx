import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { BookOpen, Eye, Heart, Tablet } from "lucide-react";
import type { Book } from "../backend";
import { useWishlist } from "../hooks/useWishlist";

const BOOK_COVERS: Record<string, string> = {
  "The Echo Chamber": "/assets/generated/book-echo-chamber.dim_400x600.jpg",
  "The Silence Between":
    "/assets/generated/book-silence-between.dim_400x600.jpg",
  "Fractured Mirrors":
    "/assets/generated/book-fractured-mirrors.dim_400x600.jpg",
  "The Weight of Remembering":
    "/assets/generated/book-weight-remembering.dim_400x600.jpg",
  "Beneath the Unnamed":
    "/assets/generated/book-beneath-unnamed.dim_400x600.jpg",
};

export function getBookCover(book: Book): string | null {
  if (book.coverUrl) return book.coverUrl;
  return BOOK_COVERS[book.title] || null;
}

interface BookCardProps {
  book: Book;
  view?: "grid" | "list";
  index?: number;
}

export default function BookCard({
  book,
  view = "grid",
  index = 1,
}: BookCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const bookId = String(book.id);
  const wished = isInWishlist(bookId);
  const cover = getBookCover(book);

  if (view === "list") {
    return (
      <div
        data-ocid={`book.item.${index}`}
        className="glass rounded-2xl p-4 flex gap-6 transition-all duration-300 hover:shadow-gold group"
      >
        <div className="w-24 h-36 flex-shrink-0 rounded-lg overflow-hidden">
          {cover ? (
            <img
              src={cover}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
              <span className="text-primary font-serif text-xl font-bold">
                {book.title[0] ?? "?"}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-serif text-xl font-semibold text-foreground line-clamp-1">
                {book.title}
              </h3>
              {book.subtitle && (
                <p className="text-muted-foreground text-sm">{book.subtitle}</p>
              )}
            </div>
            <button
              type="button"
              data-ocid={`book.toggle.${index}`}
              onClick={() => toggleWishlist(bookId)}
              className="flex-shrink-0 p-1 transition-colors"
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={`w-5 h-5 ${wished ? "fill-primary text-primary" : "text-muted-foreground hover:text-primary"}`}
              />
            </button>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {book.genres.map((g) => (
              <Badge
                key={g}
                variant="outline"
                className="text-[10px] border-white/20 text-white/60"
              >
                {g}
              </Badge>
            ))}
          </div>
          <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
            {book.description}
          </p>
          <div className="flex flex-wrap gap-1 mt-3">
            {book.formats.map((f) => (
              <Badge
                key={f}
                variant="outline"
                className="text-xs border-primary/40 text-primary"
              >
                {f}
              </Badge>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <Link to="/books/$id" params={{ id: bookId }}>
              <Button
                data-ocid={`book.secondary_button.${index}`}
                size="sm"
                variant="outline"
                className="gap-1 border-primary/50 text-primary hover:bg-primary/10"
              >
                <Eye className="w-3.5 h-3.5" /> View Book
              </Button>
            </Link>
            {book.amazonEbookLink && (
              <a
                href={book.amazonEbookLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  data-ocid={`book.primary_button.${index}`}
                  size="sm"
                  className="gap-1 bg-primary text-primary-foreground hover:brightness-110"
                >
                  <Tablet className="w-3.5 h-3.5" /> eBook
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
                  data-ocid={`book.secondary_button.${index}`}
                  size="sm"
                  variant="outline"
                  className="gap-1 border-primary/50 text-primary hover:bg-primary/10"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Print
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      data-ocid={`book.item.${index}`}
      className="glass rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-gold group border-t-2 border-t-transparent hover:border-t-primary"
    >
      <div className="relative overflow-hidden h-72">
        {cover ? (
          <img
            src={cover}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/50 flex items-center justify-center">
            <span className="text-primary font-serif text-4xl font-bold">
              {book.title[0] ?? "?"}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <button
          type="button"
          data-ocid={`book.toggle.${index}`}
          onClick={() => toggleWishlist(bookId)}
          className="absolute top-3 right-3 p-2 rounded-full glass transition-all"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 ${wished ? "fill-primary text-primary" : "text-foreground"}`}
          />
        </button>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1 mb-2">
          {book.genres.slice(0, 2).map((g) => (
            <Badge
              key={g}
              variant="outline"
              className="text-[10px] border-white/20 text-white/60"
            >
              {g}
            </Badge>
          ))}
        </div>
        <h3 className="font-serif text-xl font-semibold text-foreground leading-tight">
          {book.title}
        </h3>
        {book.subtitle && (
          <p className="text-muted-foreground text-xs mt-0.5">
            {book.subtitle}
          </p>
        )}
        <p className="text-muted-foreground text-sm mt-2 line-clamp-3 flex-1">
          {book.description}
        </p>
        <div className="flex flex-wrap gap-1 mt-3">
          {book.formats.map((f) => (
            <Badge
              key={f}
              variant="outline"
              className="text-xs border-primary/40 text-primary"
            >
              {f}
            </Badge>
          ))}
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mt-4" />
        <div className="flex gap-2 mt-4">
          <Link to="/books/$id" params={{ id: bookId }} className="flex-1">
            <Button
              data-ocid={`book.secondary_button.${index}`}
              variant="outline"
              size="sm"
              className="w-full border-primary/50 text-primary hover:bg-primary/10"
            >
              <Eye className="w-3.5 h-3.5 mr-1" /> View Book
            </Button>
          </Link>
          {book.amazonEbookLink && (
            <a
              href={book.amazonEbookLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                data-ocid={`book.primary_button.${index}`}
                size="sm"
                className="bg-primary text-primary-foreground hover:brightness-110"
                title="Kindle / eBook"
              >
                <Tablet className="w-3.5 h-3.5" />
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
                data-ocid={`book.secondary_button.${index}`}
                size="sm"
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/10"
                title="Paperback"
              >
                <BookOpen className="w-3.5 h-3.5" />
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
