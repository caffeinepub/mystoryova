import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { useMetaTags } from "../hooks/useMetaTags";
import { useGetBlogPost, useGetPublishedBlogPosts } from "../hooks/useQueries";

export default function BlogDetailPage() {
  const { id } = useParams({ from: "/blog/$id" });
  const { data: post, isLoading } = useGetBlogPost(id);
  const { data: allPosts = [] } = useGetPublishedBlogPosts();
  const related = allPosts.filter((p) => String(p.id) !== id).slice(0, 3);

  useMetaTags({ title: post?.title, description: post?.excerpt });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    );
  }

  if (!post)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Article not found.</p>
      </div>
    );

  return (
    <div className="min-h-screen">
      <div className="relative py-20 px-6 cinematic-bg">
        <div className="absolute inset-0 vignette pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <Link
            to="/blog"
            data-ocid="blog.link"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Insights
          </Link>
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((t) => (
              <Badge key={t} variant="secondary" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {t}
              </Badge>
            ))}
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" /> {post.publishedDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {Number(post.readTime)} min read
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="glass rounded-2xl p-8 md:p-12 mb-16">
          <p className="font-serif text-lg text-foreground leading-loose italic mb-8 text-primary">
            {post.excerpt}
          </p>
          <div className="prose prose-invert max-w-none">
            {post.content.split("\n\n").map((para) => (
              <p
                key={para.slice(0, 40)}
                className="text-muted-foreground leading-relaxed mb-6"
              >
                {para}
              </p>
            ))}
          </div>
        </div>
        {related.length > 0 && (
          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-8">
              More from the Journal
            </h2>
            <div className="flex flex-col gap-4">
              {related.map((rp) => (
                <Link
                  key={String(rp.id)}
                  to="/blog/$id"
                  params={{ id: String(rp.id) }}
                  data-ocid="blog.link"
                  className="glass rounded-2xl p-5 hover:shadow-gold transition-all group"
                >
                  <h3 className="font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
                    {rp.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                    {rp.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
