import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutGrid, List, RefreshCw, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import BookCard from "../components/BookCard";
import ScrollReveal from "../components/ScrollReveal";
import { useMetaTags } from "../hooks/useMetaTags";
import { useGetAllBooks, useRecordPageVisit } from "../hooks/useQueries";

export default function BooksPage() {
  useMetaTags({
    title: "Books",
    description: "Explore the complete collection of books by O. Chiddarwar.",
  });
  const { data: books = [], isLoading, isError, refetch } = useGetAllBooks();
  const recordVisit = useRecordPageVisit();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [genreFilter, setGenreFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  // biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount
  useEffect(() => {
    recordVisit.mutate("books");
  }, []);

  const genres = useMemo(
    () => [
      "all",
      ...Array.from(
        new Set(
          books.flatMap((b) =>
            (b.genres ?? []).filter((g) => g && g.trim() !== ""),
          ),
        ),
      ),
    ],
    [books],
  );

  const formats = useMemo(
    () => [
      "all",
      ...Array.from(
        new Set(
          books.flatMap((b) =>
            (b.formats ?? []).filter((f) => f && f.trim() !== ""),
          ),
        ),
      ),
    ],
    [books],
  );

  const filtered = useMemo(() => {
    let result = [...books];
    if (genreFilter !== "all")
      result = result.filter((b) => (b.genres ?? []).includes(genreFilter));
    if (formatFilter !== "all")
      result = result.filter((b) => (b.formats ?? []).includes(formatFilter));
    if (sortBy === "title")
      result.sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));
    else
      result.sort((a, b) =>
        (b.publishedDate ?? "").localeCompare(a.publishedDate ?? ""),
      );
    return result;
  }, [books, genreFilter, formatFilter, sortBy]);

  if (isError) {
    return (
      <div
        data-ocid="books.error_state"
        className="min-h-screen flex items-center justify-center px-6"
      >
        <div className="glass rounded-2xl p-10 text-center space-y-6 max-w-md w-full border border-primary/20">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <RefreshCw className="w-7 h-7 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl text-foreground">
              Unable to Load Books
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We couldn't reach the library right now. Please check your
              connection and try again.
            </p>
          </div>
          <Button
            data-ocid="books.primary_button"
            onClick={() => refetch()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div
        className="relative py-24 px-6 text-center cinematic-bg"
        data-ocid="books.section"
      >
        <div className="absolute inset-0 vignette pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.3em] text-primary mb-4">
            THE LIBRARY
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6">
            All Books
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Every book is a door. Step through and discover what you've been
            carrying all along.
          </p>
        </div>
      </div>
      <div className="sticky top-16 z-40 border-b border-white/10 glass">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center gap-3">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <Select value={genreFilter} onValueChange={setGenreFilter}>
            <SelectTrigger
              data-ocid="books.select"
              className="w-40 h-8 text-xs bg-muted/30 border-white/10"
            >
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              {genres.map((g) => (
                <SelectItem key={g} value={g} className="text-xs">
                  {g === "all" ? "All Genres" : g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={formatFilter} onValueChange={setFormatFilter}>
            <SelectTrigger
              data-ocid="books.select"
              className="w-40 h-8 text-xs bg-muted/30 border-white/10"
            >
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              {formats.map((f) => (
                <SelectItem key={f} value={f} className="text-xs">
                  {f === "all" ? "All Formats" : f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger
              data-ocid="books.select"
              className="w-36 h-8 text-xs bg-muted/30 border-white/10"
            >
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date" className="text-xs">
                Newest First
              </SelectItem>
              <SelectItem value="title" className="text-xs">
                Title A-Z
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto flex gap-1">
            <Button
              data-ocid="books.toggle"
              variant={view === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("grid")}
              className="h-8 px-3"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              data-ocid="books.toggle"
              variant={view === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
              className="h-8 px-3"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {isLoading ? (
          <div
            className={
              view === "grid"
                ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton
                key={i}
                className={
                  view === "grid" ? "h-96 rounded-2xl" : "h-32 rounded-2xl"
                }
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div data-ocid="books.empty_state" className="text-center py-24">
            <p className="text-muted-foreground text-lg">
              No books match your filters.
            </p>
          </div>
        ) : (
          <div
            data-ocid="books.list"
            className={
              view === "grid"
                ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {filtered.map((book, i) => (
              <ScrollReveal key={String(book.id)} delay={Math.min(i * 80, 400)}>
                <BookCard book={book} view={view} index={i + 1} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
