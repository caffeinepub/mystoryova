import { useEffect } from "react";
import ScrollReveal from "../components/ScrollReveal";
import { useMetaTags } from "../hooks/useMetaTags";
import { useRecordPageVisit } from "../hooks/useQueries";

export default function AboutPage() {
  useMetaTags({
    title: "About",
    description:
      "Meet O. Chiddarwar — the author behind stories that haunt and truths that heal.",
  });
  const recordVisit = useRecordPageVisit();

  // biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount
  useEffect(() => {
    recordVisit.mutate("about");
  }, []);

  return (
    <div className="min-h-screen">
      <div
        className="relative py-24 px-6 cinematic-bg"
        data-ocid="about.section"
      >
        <div className="absolute inset-0 vignette pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <p className="text-xs tracking-[0.3em] text-primary mb-4 text-center">
            THE AUTHOR
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-16 text-center">
            O. Chiddarwar
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="flex justify-center">
              <div className="w-72 h-96 rounded-2xl glass flex flex-col items-center justify-center shadow-cinematic relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/30" />
                <span className="font-serif text-8xl font-bold text-gradient-gold relative z-10">
                  O.C.
                </span>
                <p className="text-muted-foreground text-sm mt-4 tracking-widest relative z-10">
                  AUTHOR PHOTO
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <p className="text-foreground text-lg leading-relaxed">
                The author is a versatile writer with a passion for storytelling
                across multiple genres. With a strong interest in exploring
                human emotions, relationships, and imaginative ideas, the author
                enjoys creating stories that connect deeply with readers. From
                romance and drama to mystery and thought-provoking narratives,
                the writing reflects creativity, curiosity, and a desire to tell
                meaningful stories.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Through each work, the author aims to craft engaging and
                memorable narratives that inspire readers and leave a lasting
                impression.
              </p>
              <blockquote className="border-l-2 border-primary pl-6 mt-6">
                <p className="font-serif italic text-muted-foreground text-lg leading-relaxed">
                  &ldquo;Every story I write is a search for something I
                  can&rsquo;t yet name.&rdquo;
                </p>
                <cite className="text-xs tracking-widest text-primary mt-3 block not-italic">
                  &mdash; O. CHIDDARWAR
                </cite>
              </blockquote>
              <a
                href="https://www.amazon.com/author/o.chiddarwar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 px-6 py-2.5 border border-primary/50 text-primary text-xs tracking-widest hover:bg-primary/10 transition-colors rounded-full"
              >
                VIEW ON AMAZON
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <ScrollReveal>
          <section className="text-center">
            <div className="section-divider mb-12" />
            <p className="text-xs tracking-[0.3em] text-primary mb-4">
              CONNECT
            </p>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
              Follow the Journey
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Follow on Instagram for writing updates, behind-the-scenes
              moments, and the stories that don&rsquo;t make it into books.
            </p>
            <a
              href="https://www.instagram.com/mystoryova?igsh=MW9zZjdscWtodXpwNg=="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 px-8 py-3 border border-primary/50 text-primary text-sm tracking-widest hover:bg-primary/10 transition-colors rounded-full"
            >
              @MYSTORYOVA
            </a>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
