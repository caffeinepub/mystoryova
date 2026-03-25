import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Loader2, Mail, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { SiFacebook, SiInstagram } from "react-icons/si";
import { toast } from "sonner";
import ScrollReveal from "../components/ScrollReveal";
import { useMetaTags } from "../hooks/useMetaTags";
import { useRecordPageVisit, useSubmitContactForm } from "../hooks/useQueries";

export default function ContactPage() {
  useMetaTags({
    title: "Contact",
    description:
      "Get in touch with O. Chiddarwar for book clubs, media, collaboration.",
  });
  const submitForm = useSubmitContactForm();
  const recordVisit = useRecordPageVisit();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    inquiryType: "General",
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount
  useEffect(() => {
    recordVisit.mutate("contact");
  }, []);

  const handleChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm.mutate(
      { id: BigInt(0), ...form, submittedAt: new Date().toISOString() },
      {
        onSuccess: () => {
          toast.success("Message received. I'll be in touch.");
          setForm({ name: "", email: "", message: "", inquiryType: "General" });
        },
        onError: () => toast.error("Failed to send. Please try again."),
      },
    );
  };

  return (
    <div className="min-h-screen">
      <div
        className="relative py-24 px-6 text-center cinematic-bg"
        data-ocid="contact.section"
      >
        <div className="absolute inset-0 vignette pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.3em] text-primary mb-4">
            REACH OUT
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6">
            Get in Touch
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            For book clubs, media inquiries, collaborations, or simply to share
            how a book changed you.
          </p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        <ScrollReveal>
          <div className="glass rounded-2xl p-8">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
              Send a Message
            </h2>
            <form
              onSubmit={handleSubmit}
              data-ocid="contact.modal"
              className="space-y-5"
            >
              <div>
                <Label htmlFor="contact-name">Name</Label>
                <Input
                  data-ocid="contact.input"
                  id="contact-name"
                  value={form.name}
                  onChange={handleChange("name")}
                  required
                  className="mt-1 bg-muted/30 border-white/10"
                />
              </div>
              <div>
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  data-ocid="contact.input"
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  required
                  className="mt-1 bg-muted/30 border-white/10"
                />
              </div>
              <div>
                <Label>Inquiry Type</Label>
                <Select
                  value={form.inquiryType}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, inquiryType: v }))
                  }
                >
                  <SelectTrigger
                    data-ocid="contact.select"
                    className="mt-1 bg-muted/30 border-white/10"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "General",
                      "Book Club",
                      "Media / Press",
                      "Collaboration",
                      "Other",
                    ].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="contact-message">Message</Label>
                <Textarea
                  data-ocid="contact.textarea"
                  id="contact-message"
                  value={form.message}
                  onChange={handleChange("message")}
                  required
                  rows={5}
                  className="mt-1 bg-muted/30 border-white/10"
                />
              </div>
              <Button
                data-ocid="contact.submit_button"
                type="submit"
                disabled={submitForm.isPending}
                className="w-full bg-primary text-primary-foreground hover:brightness-110"
              >
                {submitForm.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <div className="space-y-8">
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-primary" />
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  Direct Contact
                </h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                For urgent inquiries or literary agency communications:
              </p>
              <a
                href="mailto:mystoryova@gmail.com"
                className="text-primary hover:underline text-sm"
              >
                mystoryova@gmail.com
              </a>
            </div>
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  Collaboration
                </h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Open to book club visits, guest lectures, writing workshops,
                literary festival panels, and creative partnerships.
              </p>
            </div>
            <div className="glass rounded-2xl p-8">
              <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                Follow the Journey
              </h3>
              <div className="flex flex-col gap-3">
                <a
                  href="https://www.instagram.com/mystoryova?igsh=MW9zZjdscWtodXpwNg=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <SiInstagram className="w-5 h-5" /> Instagram
                </a>
                <a
                  href="https://www.facebook.com/share/18R1ypxq4q/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <SiFacebook className="w-5 h-5" /> Facebook
                </a>
                <a
                  href="https://www.amazon.com/author/o.chiddarwar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <BookOpen className="w-5 h-5" /> Amazon Author Page
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
