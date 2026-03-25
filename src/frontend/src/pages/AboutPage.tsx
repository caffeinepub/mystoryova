import { Award, BookOpen, Calendar, Pen } from "lucide-react";
import { useEffect } from "react";
import ScrollReveal from "../components/ScrollReveal";
import { useMetaTags } from "../hooks/useMetaTags";
import { useRecordPageVisit } from "../hooks/useQueries";

const MILESTONES = [
  {
    year: "2015",
    event:
      "Published debut novella 'Quiet Thresholds' — received regional literary award for psychological fiction.",
  },
  {
    year: "2017",
    event:
      "'The Silence Between' becomes bestseller in literary fiction, translated into six languages.",
  },
  {
    year: "2019",
    event:
      "Writer-in-Residence at the Mahindra Humanities Center, Harvard. Completed 'Fractured Mirrors'.",
  },
  {
    year: "2021",
    event:
      "'The Echo Chamber' wins the DSC Prize for South Asian Literature. Over 100,000 copies sold.",
  },
  {
    year: "2023",
    event:
      "'The Weight of Remembering' longlisted for the Booker Prize. International speaking tour across 12 countries.",
  },
  {
    year: "2024",
    event:
      "'Beneath the Unnamed' releases to critical acclaim. Named one of Time Magazine's 100 Most Influential People.",
  },
];

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
                O. Chiddarwar is an award-winning author of psychological and
                emotional fiction, celebrated for exploring the inner
                architecture of trauma, memory, and human connection with
                unflinching precision and literary grace.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Born in Pune, India, and educated at JNU Delhi and Cambridge,
                Chiddarwar's work has been described as "excavations of the
                soul" — fiction that doesn't just tell stories, but demands that
                readers confront the truths they carry.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                With six internationally published novels, awards from three
                continents, and a readership spanning literary clubs, therapy
                offices, and university syllabi, O. Chiddarwar occupies a rare
                space: the intersection of the intellectually rigorous and the
                deeply felt.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm text-primary">
                  <BookOpen className="w-4 h-4" /> 6 Published Novels
                </div>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Award className="w-4 h-4" /> 4 Major Literary Awards
                </div>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Pen className="w-4 h-4" /> 12 Languages Translated
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20 space-y-16">
        <ScrollReveal>
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-8">
              Writing Philosophy
            </h2>
            <div className="space-y-6">
              <div className="glass rounded-2xl p-8">
                <h3 className="font-serif text-xl font-semibold text-primary mb-4">
                  The Obligation of Honesty
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Literature, for me, is not entertainment — though it can be.
                  It is testimony. Every character I write is someone's truth
                  rendered visible. The psychological interior of a person is
                  the most complex, contested, and profoundly political terrain
                  there is. I write to map it, not to conquer it.
                </p>
              </div>
              <div className="glass rounded-2xl p-8">
                <h3 className="font-serif text-xl font-semibold text-primary mb-4">
                  Healing Through Darkness
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  People often ask why my books are so dark. I would ask: why do
                  we assume that light is found only in brightness? My
                  characters descend into pain, addiction, grief, and betrayal
                  not because I am cruel — but because I believe, deeply, that
                  the path through is the only path out.
                </p>
              </div>
              <div className="glass rounded-2xl p-8">
                <h3 className="font-serif text-xl font-semibold text-primary mb-4">
                  The Reader as Co-Author
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  A book is not finished when it leaves the author's hands. It
                  begins when it enters the reader's mind. Every interpretation
                  is valid. Every emotional response is correct. I write the
                  first half of the truth. The reader writes the second.
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section data-ocid="timeline.section">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-12">
              Milestones
            </h2>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-primary/20 to-transparent" />
              <div className="space-y-8">
                {MILESTONES.map((m) => (
                  <ScrollReveal key={m.year} delay={100}>
                    <div
                      data-ocid={`timeline.item.${m.year}`}
                      className="flex gap-6 items-start relative pl-4"
                    >
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                        </div>
                      </div>
                      <div className="glass rounded-2xl p-6 flex-1">
                        <span className="text-primary font-semibold text-sm tracking-widest">
                          {m.year}
                        </span>
                        <p className="text-foreground mt-2 leading-relaxed">
                          {m.event}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
