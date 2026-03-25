import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import { useEffect } from "react";
import ScrollReveal from "../components/ScrollReveal";
import { useMetaTags } from "../hooks/useMetaTags";
import {
  useGetPublishedBlogPosts,
  useRecordPageVisit,
} from "../hooks/useQueries";

const GRAD_COLORS = [
  "from-primary/30 to-secondary/50",
  "from-blue-900/40 to-primary/20",
  "from-secondary/50 to-primary/10",
  "from-primary/20 to-blue-900/30",
];

export default function BlogPage() {
  useMetaTags({
    title: "Insights",
    description: "Essays and reflections from O. Chiddarwar.",
  });
  const { data: posts = [], isLoading } = useGetPublishedBlogPosts();
  const recordVisit = useRecordPageVisit();

  // biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount
  useEffect(() => {
    recordVisit.mutate("blog");
  }, []);

  return (
    <div className="min-h-screen">
      <div
        className="relative py-24 px-6 text-center cinematic-bg"
        data-ocid="blog.section"
      >
        <div className="absolute inset-0 vignette pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.3em] text-primary mb-4">
            THE JOURNAL
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6">
            Insights
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Reflections on writing, the human psyche, and what it means to tell
            the truth obliquely.
          </p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-16">
        {isLoading ? (
          <div className="flex flex-col gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div data-ocid="blog.empty_state" className="text-center py-24">
            <p className="text-muted-foreground text-lg">
              No articles published yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-8" data-ocid="blog.list">
            {posts.map((post, i) => (
              <ScrollReveal key={String(post.id)} delay={i * 100}>
                <Link
                  to="/blog/$id"
                  params={{ id: String(post.id) }}
                  data-ocid={`blog.item.${i + 1}`}
                >
                  <article className="glass rounded-2xl overflow-hidden hover:shadow-gold transition-all duration-300 group flex flex-col md:flex-row">
                    <div
                      className={`md:w-56 h-40 md:h-auto bg-gradient-to-br ${GRAD_COLORS[i % GRAD_COLORS.length]} flex-shrink-0 relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-serif text-5xl font-bold text-primary/40 group-hover:scale-110 transition-transform">
                          {post.title[0]}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />{" "}
                          {post.publishedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />{" "}
                          {Number(post.readTime)} min read
                        </span>
                        <span className="ml-auto flex items-center gap-1 text-primary font-medium">
                          Read <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
