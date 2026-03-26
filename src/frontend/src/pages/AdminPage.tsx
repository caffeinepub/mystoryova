import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { HttpAgent } from "@icp-sdk/core/agent";
import {
  BookOpen,
  Eye,
  EyeOff,
  ImagePlus,
  KeyRound,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { BlogPost, Book } from "../backend";
import { loadConfig } from "../config";
import { useActor } from "../hooks/useActor";
import { useAdmin } from "../hooks/useAdmin";
import { useMetaTags } from "../hooks/useMetaTags";
import {
  useCreateBlogPost,
  useCreateBook,
  useDeleteBlogPost,
  useDeleteBook,
  useGetAllBlogPosts,
  useGetAllBooks,
  useGetAllContactSubmissions,
  useGetAllPageVisits,
  useGetAllSubscribers,
  useUpdateBlogPost,
  useUpdateBook,
} from "../hooks/useQueries";
import { StorageClient } from "../utils/StorageClient";
import AdminOrdersTab from "./AdminOrdersTab";
import AdminStoreTab from "./AdminStoreTab";

const EMPTY_BOOK: Omit<Book, "id"> = {
  title: "",
  subtitle: "",
  description: "",
  genres: [],
  formats: [],
  coverUrl: "",
  amazonEbookLink: "",
  amazonPaperbackLink: "",
  publishedDate: "",
  featured: false,
  lookInsideText: "",
  authorNotes: "",
};
const EMPTY_POST: Omit<BlogPost, "id"> = {
  title: "",
  content: "",
  excerpt: "",
  publishedDate: "",
  published: false,
  tags: [],
  readTime: BigInt(5),
};

type ForgotStep = "email" | "pin";

function LoginForm() {
  const { login } = useAdmin();
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState<ForgotStep>("email");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [generatedPin, setGeneratedPin] = useState("");
  const [enteredPin, setEnteredPin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [resetDone, setResetDone] = useState(false);
  const { actor } = useActor();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(password);
    if (!ok) {
      setError("Incorrect password.");
    } else setError("");
  };

  const handleRequestPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotLoading(true);
    try {
      const result = await actor?.generateResetPin(
        recoveryEmail.trim().toLowerCase(),
      );
      if (!result) {
        setForgotError("That email is not registered for password recovery.");
      } else {
        setGeneratedPin(result as string);
        setForgotStep("pin");
      }
    } catch {
      setForgotError("Something went wrong. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    if (newPassword !== confirmPassword) {
      setForgotError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setForgotError("Password must be at least 6 characters.");
      return;
    }
    setForgotLoading(true);
    try {
      const ok = await actor?.verifyResetPinAndChangePassword(
        enteredPin.trim(),
        newPassword,
      );
      if (ok) {
        setResetDone(true);
        setGeneratedPin("");
      } else {
        setForgotError("Invalid or expired PIN. Please request a new one.");
      }
    } catch {
      setForgotError("Something went wrong. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const resetForgotFlow = () => {
    setForgotStep("email");
    setRecoveryEmail("");
    setGeneratedPin("");
    setEnteredPin("");
    setNewPassword("");
    setConfirmPassword("");
    setForgotError("");
    setResetDone(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div
        className="glass rounded-2xl p-10 w-full max-w-md"
        data-ocid="admin.modal"
      >
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
          Admin Access
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Enter your password to access the dashboard.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="admin-pw">Password</Label>
            <div className="relative mt-1">
              <Input
                data-ocid="admin.input"
                id="admin-pw"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-muted/30 border-white/10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPw ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          {error && (
            <p
              data-ocid="admin.error_state"
              className="text-destructive text-sm"
            >
              {error}
            </p>
          )}
          <Button
            data-ocid="admin.submit_button"
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:brightness-110"
          >
            Enter Dashboard
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setShowForgot((v) => !v);
              resetForgotFlow();
            }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {showForgot && (
          <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <KeyRound className="w-4 h-4 shrink-0" />
              <span className="text-sm font-semibold">Password Recovery</span>
            </div>

            {resetDone ? (
              <p className="text-sm text-green-500 font-medium">
                Password changed successfully. You can now log in with your new
                password.
              </p>
            ) : forgotStep === "email" ? (
              <form onSubmit={handleRequestPin} className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Enter the registered recovery email to receive a reset PIN.
                </p>
                <div>
                  <Label htmlFor="recovery-email" className="text-xs">
                    Recovery Email
                  </Label>
                  <Input
                    id="recovery-email"
                    type="email"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="mt-1 bg-muted/30 border-white/10 text-sm"
                  />
                </div>
                {forgotError && (
                  <p className="text-destructive text-xs">{forgotError}</p>
                )}
                <Button
                  type="submit"
                  disabled={forgotLoading}
                  size="sm"
                  className="w-full bg-primary text-primary-foreground"
                >
                  {forgotLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {forgotLoading ? "Sending..." : "Send Reset PIN"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyPin} className="space-y-3">
                {generatedPin && (
                  <div className="rounded-lg border border-primary/40 bg-primary/10 p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">
                      Your reset PIN
                    </p>
                    <p className="font-mono text-2xl font-bold tracking-widest text-primary">
                      {generatedPin}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Valid for 10 minutes
                    </p>
                  </div>
                )}
                <div>
                  <Label htmlFor="reset-pin" className="text-xs">
                    Enter PIN
                  </Label>
                  <Input
                    id="reset-pin"
                    type="text"
                    value={enteredPin}
                    onChange={(e) => setEnteredPin(e.target.value)}
                    placeholder="6-digit PIN"
                    maxLength={6}
                    required
                    className="mt-1 bg-muted/30 border-white/10 text-sm font-mono tracking-widest text-center"
                  />
                </div>
                <div>
                  <Label htmlFor="new-pw" className="text-xs">
                    New Password
                  </Label>
                  <Input
                    id="new-pw"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    className="mt-1 bg-muted/30 border-white/10 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-pw" className="text-xs">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirm-pw"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    required
                    className="mt-1 bg-muted/30 border-white/10 text-sm"
                  />
                </div>
                {forgotError && (
                  <p className="text-destructive text-xs">{forgotError}</p>
                )}
                <Button
                  type="submit"
                  disabled={forgotLoading}
                  size="sm"
                  className="w-full bg-primary text-primary-foreground"
                >
                  {forgotLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {forgotLoading ? "Resetting..." : "Reset Password"}
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setForgotStep("email");
                    setForgotError("");
                  }}
                  className="text-xs text-muted-foreground hover:text-primary w-full text-center"
                >
                  ← Use a different email
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BookForm({
  book,
  onSave,
  onClose,
}: { book?: Book; onSave: (b: Book) => void; onClose: () => void }) {
  const [form, setForm] = useState<Omit<Book, "id">>({
    ...EMPTY_BOOK,
    ...(book ? { ...book } : {}),
  });
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverUploadProgress, setCoverUploadProgress] = useState(0);
  const [urlMode, setUrlMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    setCoverUploading(true);
    setCoverUploadProgress(0);

    try {
      // Compress image using canvas
      const compressedDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = new Image();
          img.onload = () => {
            const MAX_WIDTH = 400;
            const scale = img.width > MAX_WIDTH ? MAX_WIDTH / img.width : 1;
            const canvas = document.createElement("canvas");
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              reject(new Error("Canvas not supported"));
              return;
            }
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/jpeg", 0.7));
          };
          img.onerror = reject;
          img.src = ev.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Convert data URL to bytes
      if (!compressedDataUrl.includes(","))
        throw new Error("Invalid image data URL");
      const base64 = compressedDataUrl.split(",")[1];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      // Upload to blob storage
      const config = await loadConfig();
      const agent = new HttpAgent({ host: config.backend_host });
      if (config.backend_host?.includes("localhost")) {
        await agent.fetchRootKey().catch(() => {});
      }
      const storageClient = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );
      const { hash } = await storageClient.putFile(bytes, (pct) => {
        setCoverUploadProgress(Math.round(pct));
      });
      const url = await storageClient.getDirectURL(hash);
      setForm((p) => ({ ...p, coverUrl: url }));
      setCoverUploadProgress(100);
      toast.success("Cover uploaded successfully");
    } catch {
      toast.error("Failed to upload image. Try pasting a URL instead.");
    } finally {
      setCoverUploading(false);
      setTimeout(() => setCoverUploadProgress(0), 600);
    }
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      <div>
        <Label>Title</Label>
        <Input
          data-ocid="admin.input"
          value={form.title}
          onChange={set("title")}
          className="mt-1 bg-muted/30 border-white/10"
        />
      </div>
      <div>
        <Label>Subtitle</Label>
        <Input
          data-ocid="admin.input"
          value={form.subtitle}
          onChange={set("subtitle")}
          className="mt-1 bg-muted/30 border-white/10"
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          data-ocid="admin.textarea"
          value={form.description}
          onChange={set("description")}
          rows={3}
          className="mt-1 bg-muted/30 border-white/10"
        />
      </div>
      <div>
        <Label>Genres (comma-separated)</Label>
        <Input
          data-ocid="admin.input"
          value={form.genres.join(", ")}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              genres: e.target.value.split(",").map((s) => s.trim()),
            }))
          }
          className="mt-1 bg-muted/30 border-white/10"
        />
      </div>
      <div>
        <Label>Formats (comma-separated)</Label>
        <Input
          data-ocid="admin.input"
          value={form.formats.join(", ")}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              formats: e.target.value.split(",").map((s) => s.trim()),
            }))
          }
          className="mt-1 bg-muted/30 border-white/10"
        />
      </div>

      {/* ── Book Cover Upload ── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Book Cover</Label>
          <button
            type="button"
            onClick={() => setUrlMode((v) => !v)}
            className="text-xs text-primary hover:underline"
          >
            {urlMode ? "← Upload file" : "Paste URL instead →"}
          </button>
        </div>

        <div className="flex gap-4 items-start">
          {/* Cover preview or placeholder */}
          <div
            className="flex-shrink-0 w-28 h-40 rounded-xl border border-white/15 bg-muted/20 overflow-hidden relative group"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
          >
            {form.coverUrl ? (
              <>
                <img
                  src={form.coverUrl}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <button
                  type="button"
                  data-ocid="admin.delete_button"
                  onClick={() => {
                    setForm((p) => ({ ...p, coverUrl: "" }));
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <BookOpen className="w-8 h-8 opacity-40" />
                <span className="text-[10px] text-center px-2 opacity-50 leading-tight">
                  No cover
                </span>
              </div>
            )}
          </div>

          {/* Upload controls */}
          <div className="flex-1 space-y-3">
            {!urlMode ? (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  data-ocid="admin.upload_button"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={coverUploading}
                  className="w-full flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-xl border-2 border-dashed border-white/20 bg-muted/10 hover:bg-muted/20 hover:border-primary/50 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
                  data-ocid="admin.dropzone"
                >
                  {coverUploading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  ) : (
                    <ImagePlus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                    {coverUploading
                      ? `Uploading… ${coverUploadProgress}%`
                      : "Click to upload cover image"}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60">
                    JPG, PNG, WEBP — max 10 MB
                  </span>
                </button>
                {coverUploading && (
                  <Progress
                    value={coverUploadProgress}
                    className="h-1"
                    data-ocid="admin.loading_state"
                  />
                )}
              </>
            ) : (
              <>
                <Input
                  data-ocid="admin.input"
                  placeholder="https://example.com/cover.jpg"
                  value={form.coverUrl.startsWith("data:") ? "" : form.coverUrl}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, coverUrl: e.target.value }))
                  }
                  className="bg-muted/30 border-white/10 text-sm"
                />
                <p className="text-[11px] text-muted-foreground/70">
                  Paste a direct image URL from Amazon, Goodreads, or your CDN.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      {/* ── End Cover Upload ── */}

      <div>
        <Label>Amazon eBook Link (Kindle)</Label>
        <Input
          data-ocid="admin.input"
          value={form.amazonEbookLink}
          onChange={set("amazonEbookLink")}
          className="mt-1 bg-muted/30 border-white/10"
          placeholder="https://www.amazon.com/dp/..."
        />
      </div>
      <div>
        <Label>Amazon Paperback Link</Label>
        <Input
          data-ocid="admin.input"
          value={form.amazonPaperbackLink}
          onChange={set("amazonPaperbackLink")}
          className="mt-1 bg-muted/30 border-white/10"
          placeholder="https://www.amazon.com/dp/..."
        />
      </div>
      <div>
        <Label>Published Date</Label>
        <Input
          data-ocid="admin.input"
          type="date"
          value={form.publishedDate}
          onChange={set("publishedDate")}
          className="mt-1 bg-muted/30 border-white/10"
        />
      </div>
      <div>
        <Label>Look Inside Text</Label>
        <Textarea
          data-ocid="admin.textarea"
          value={form.lookInsideText}
          onChange={set("lookInsideText")}
          rows={3}
          className="mt-1 bg-muted/30 border-white/10"
        />
      </div>
      <div>
        <Label>Author Notes</Label>
        <Textarea
          data-ocid="admin.textarea"
          value={form.authorNotes}
          onChange={set("authorNotes")}
          rows={3}
          className="mt-1 bg-muted/30 border-white/10"
        />
      </div>
      <div className="flex items-center gap-3">
        <Switch
          checked={form.featured}
          onCheckedChange={(v) => setForm((p) => ({ ...p, featured: v }))}
          data-ocid="admin.switch"
        />
        <Label>Featured</Label>
      </div>
      <div className="flex gap-3 pt-2">
        <Button
          data-ocid="admin.save_button"
          onClick={() => onSave({ id: book?.id ?? BigInt(0), ...form })}
          className="bg-primary text-primary-foreground hover:brightness-110"
        >
          Save Book
        </Button>
        <Button
          data-ocid="admin.cancel_button"
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

function PostForm({
  post,
  onSave,
  onClose,
}: { post?: BlogPost; onSave: (p: BlogPost) => void; onClose: () => void }) {
  const [form, setForm] = useState<Omit<BlogPost, "id">>({
    ...EMPTY_POST,
    ...(post ? { ...post } : {}),
  });
  const set =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div>
        <Label>Title</Label>
        <Input
          data-ocid="admin.input"
          value={form.title}
          onChange={set("title")}
          className="mt-1 bg-muted/30 border-white/10"
        />
      </div>
      <div>
        <Label>Excerpt</Label>
        <Textarea
          data-ocid="admin.textarea"
          value={form.excerpt}
          onChange={set("excerpt")}
          rows={2}
          className="mt-1 bg-muted/30 border-white/10"
        />
      </div>
      <div>
        <Label>Content</Label>
        <Textarea
          data-ocid="admin.textarea"
          value={form.content}
          onChange={set("content")}
          rows={6}
          className="mt-1 bg-muted/30 border-white/10"
        />
      </div>
      <div>
        <Label>Tags (comma-separated)</Label>
        <Input
          data-ocid="admin.input"
          value={form.tags.join(", ")}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              tags: e.target.value.split(",").map((s) => s.trim()),
            }))
          }
          className="mt-1 bg-muted/30 border-white/10"
        />
      </div>
      <div>
        <Label>Published Date</Label>
        <Input
          data-ocid="admin.input"
          type="date"
          value={form.publishedDate}
          onChange={set("publishedDate")}
          className="mt-1 bg-muted/30 border-white/10"
        />
      </div>
      <div>
        <Label>Read Time (minutes)</Label>
        <Input
          data-ocid="admin.input"
          type="number"
          value={Number(form.readTime)}
          onChange={(e) =>
            setForm((p) => ({ ...p, readTime: BigInt(e.target.value || 5) }))
          }
          className="mt-1 bg-muted/30 border-white/10"
        />
      </div>
      <div className="flex items-center gap-3">
        <Switch
          checked={form.published}
          onCheckedChange={(v) => setForm((p) => ({ ...p, published: v }))}
          data-ocid="admin.switch"
        />
        <Label>Published</Label>
      </div>
      <div className="flex gap-3 pt-2">
        <Button
          data-ocid="admin.save_button"
          onClick={() => onSave({ id: post?.id ?? BigInt(0), ...form })}
          className="bg-primary text-primary-foreground hover:brightness-110"
        >
          Save Post
        </Button>
        <Button
          data-ocid="admin.cancel_button"
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  useMetaTags({ title: "Admin" });
  const { isAuthenticated, logout } = useAdmin();

  const { data: books = [], isLoading: booksLoading } = useGetAllBooks();
  const { data: blogPosts = [], isLoading: postsLoading } =
    useGetAllBlogPosts();
  const { data: subscribers = [] } = useGetAllSubscribers();
  const { data: contacts = [] } = useGetAllContactSubmissions();
  const { data: pageVisits = [] } = useGetAllPageVisits();

  const createBook = useCreateBook();
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const deletePost = useDeleteBlogPost();

  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>();
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | undefined>();
  const [deletingBookId, setDeletingBookId] = useState<bigint | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<bigint | null>(null);

  if (!isAuthenticated) return <LoginForm />;

  const handleSaveBook = (book: Book) => {
    if (book.id !== BigInt(0)) {
      updateBook.mutate(
        { id: book.id, book },
        {
          onSuccess: () => {
            toast.success("Book updated");
            setBookDialogOpen(false);
          },
          onError: () => toast.error("Failed to update book"),
        },
      );
    } else {
      createBook.mutate(book, {
        onSuccess: () => {
          toast.success("Book created");
          setBookDialogOpen(false);
        },
        onError: () => toast.error("Failed to create book"),
      });
    }
  };

  const handleSavePost = (post: BlogPost) => {
    if (post.id !== BigInt(0)) {
      updatePost.mutate(
        { id: post.id, post },
        {
          onSuccess: () => {
            toast.success("Post updated");
            setPostDialogOpen(false);
          },
          onError: () => toast.error("Failed to update post"),
        },
      );
    } else {
      createPost.mutate(post, {
        onSuccess: () => {
          toast.success("Post created");
          setPostDialogOpen(false);
        },
        onError: () => toast.error("Failed to create post"),
      });
    }
  };

  return (
    <div className="min-h-screen px-6 py-12" data-ocid="admin.section">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your literary empire.
            </p>
          </div>
          <Button
            data-ocid="admin.button"
            variant="outline"
            onClick={logout}
            className="gap-2 border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>

        <Tabs defaultValue="books" data-ocid="admin.tab">
          <TabsList className="mb-8 glass border border-white/10">
            <TabsTrigger value="books" data-ocid="admin.tab">
              Books
            </TabsTrigger>
            <TabsTrigger value="blog" data-ocid="admin.tab">
              Blog
            </TabsTrigger>
            <TabsTrigger value="analytics" data-ocid="admin.tab">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="subscribers" data-ocid="admin.tab">
              Subscribers
            </TabsTrigger>
            <TabsTrigger value="contacts" data-ocid="admin.tab">
              Contact
            </TabsTrigger>
            <TabsTrigger value="store" data-ocid="admin.tab">
              Store
            </TabsTrigger>
            <TabsTrigger value="orders" data-ocid="admin.tab">
              Orders
            </TabsTrigger>
            <TabsTrigger value="settings" data-ocid="admin.tab">
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Books */}
          <TabsContent value="books" data-ocid="admin.panel">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-xl font-semibold text-foreground">
                Books ({books.length})
              </h2>
              <Dialog open={bookDialogOpen} onOpenChange={setBookDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    data-ocid="admin.open_modal_button"
                    onClick={() => setEditingBook(undefined)}
                    className="bg-primary text-primary-foreground hover:brightness-110 gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Book
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl glass border border-white/15">
                  <DialogHeader>
                    <DialogTitle className="font-serif">
                      {editingBook ? "Edit Book" : "New Book"}
                    </DialogTitle>
                  </DialogHeader>
                  <BookForm
                    book={editingBook}
                    onSave={handleSaveBook}
                    onClose={() => setBookDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
            {booksLoading ? (
              <div
                data-ocid="admin.loading_state"
                className="text-muted-foreground"
              >
                Loading books...
              </div>
            ) : (
              <div className="glass rounded-2xl overflow-hidden">
                <Table data-ocid="admin.table">
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead>Cover</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Genres</TableHead>
                      <TableHead>Formats</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {books.map((book, i) => (
                      <TableRow
                        key={String(book.id)}
                        data-ocid={`admin.row.${i + 1}`}
                        className="border-white/10"
                      >
                        <TableCell>
                          <div className="w-10 h-14 rounded overflow-hidden bg-muted/30 border border-white/10 flex-shrink-0">
                            {book.coverUrl ? (
                              <img
                                src={book.coverUrl}
                                alt={book.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-muted-foreground opacity-40" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {book.title}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {book.genres.slice(0, 2).map((g) => (
                              <Badge
                                key={g}
                                variant="secondary"
                                className="text-xs"
                              >
                                {g}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {book.formats.map((f) => (
                              <Badge
                                key={f}
                                variant="outline"
                                className="text-xs"
                              >
                                {f}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {book.publishedDate}
                        </TableCell>
                        <TableCell>
                          {book.featured ? (
                            <Badge className="bg-primary/20 text-primary border-primary/30">
                              Yes
                            </Badge>
                          ) : (
                            "No"
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              data-ocid={`admin.edit_button.${i + 1}`}
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingBook(book);
                                setBookDialogOpen(true);
                              }}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              data-ocid={`admin.delete_button.${i + 1}`}
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                setDeletingBookId(book.id);
                                deleteBook.mutate(book.id, {
                                  onSuccess: () =>
                                    toast.success("Book deleted"),
                                  onError: () => toast.error("Failed"),
                                  onSettled: () => setDeletingBookId(null),
                                });
                              }}
                            >
                              {deletingBookId === book.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Blog */}
          <TabsContent value="blog" data-ocid="admin.panel">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-xl font-semibold text-foreground">
                Blog Posts ({blogPosts.length})
              </h2>
              <Dialog open={postDialogOpen} onOpenChange={setPostDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    data-ocid="admin.open_modal_button"
                    onClick={() => setEditingPost(undefined)}
                    className="bg-primary text-primary-foreground hover:brightness-110 gap-2"
                  >
                    <Plus className="w-4 h-4" /> New Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl glass border border-white/15">
                  <DialogHeader>
                    <DialogTitle className="font-serif">
                      {editingPost ? "Edit Post" : "New Post"}
                    </DialogTitle>
                  </DialogHeader>
                  <PostForm
                    post={editingPost}
                    onSave={handleSavePost}
                    onClose={() => setPostDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
            {postsLoading ? (
              <div
                data-ocid="admin.loading_state"
                className="text-muted-foreground"
              >
                Loading posts...
              </div>
            ) : (
              <div className="glass rounded-2xl overflow-hidden">
                <Table data-ocid="admin.table">
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Read Time</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogPosts.map((post, i) => (
                      <TableRow
                        key={String(post.id)}
                        data-ocid={`admin.row.${i + 1}`}
                        className="border-white/10"
                      >
                        <TableCell className="font-medium text-foreground">
                          {post.title}
                        </TableCell>
                        <TableCell>
                          {post.published ? (
                            <Badge className="bg-primary/20 text-primary border-primary/30">
                              Published
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {post.publishedDate}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {Number(post.readTime)} min
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              data-ocid={`admin.edit_button.${i + 1}`}
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingPost(post);
                                setPostDialogOpen(true);
                              }}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              data-ocid={`admin.delete_button.${i + 1}`}
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                setDeletingPostId(post.id);
                                deletePost.mutate(post.id, {
                                  onSuccess: () => toast.success("Deleted"),
                                  onError: () => toast.error("Failed"),
                                  onSettled: () => setDeletingPostId(null),
                                });
                              }}
                            >
                              {deletingPostId === post.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" data-ocid="admin.panel">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
              Page Visits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pageVisits.map(([page, count], i) => (
                <div
                  key={page}
                  data-ocid={`admin.card.${i + 1}`}
                  className="glass rounded-2xl p-6"
                >
                  <p className="text-muted-foreground text-xs tracking-widest uppercase mb-2">
                    {page}
                  </p>
                  <p className="font-serif text-4xl font-bold text-primary">
                    {Number(count)}
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    total visits
                  </p>
                </div>
              ))}
              {pageVisits.length === 0 && (
                <p
                  data-ocid="admin.empty_state"
                  className="text-muted-foreground col-span-3"
                >
                  No visit data yet.
                </p>
              )}
            </div>
          </TabsContent>

          {/* Subscribers */}
          <TabsContent value="subscribers" data-ocid="admin.panel">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
              Newsletter Subscribers ({subscribers.length})
            </h2>
            <div className="glass rounded-2xl overflow-hidden">
              <Table data-ocid="admin.table">
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead>Email</TableHead>
                    <TableHead>Subscribed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((sub, i) => (
                    <TableRow
                      key={sub.email}
                      data-ocid={`admin.row.${i + 1}`}
                      className="border-white/10"
                    >
                      <TableCell className="text-foreground">
                        {sub.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {sub.subscribedAt}
                      </TableCell>
                    </TableRow>
                  ))}
                  {subscribers.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        className="text-center text-muted-foreground py-8"
                      >
                        No subscribers yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Contacts */}
          <TabsContent value="contacts" data-ocid="admin.panel">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
              Contact Submissions ({contacts.length})
            </h2>
            <div className="flex flex-col gap-4">
              {contacts.map((c, i) => (
                <div
                  key={String(c.id)}
                  data-ocid={`admin.item.${i + 1}`}
                  className="glass rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-foreground">{c.name}</p>
                      <p className="text-muted-foreground text-sm">{c.email}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-xs">
                        {c.inquiryType}
                      </Badge>
                      <p className="text-muted-foreground text-xs mt-1">
                        {c.submittedAt}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mt-4 leading-relaxed">
                    {c.message}
                  </p>
                </div>
              ))}
              {contacts.length === 0 && (
                <p
                  data-ocid="admin.empty_state"
                  className="text-muted-foreground text-center py-12"
                >
                  No submissions yet.
                </p>
              )}
            </div>
          </TabsContent>
          {/* Settings */}
          <TabsContent value="store" data-ocid="admin.panel">
            <AdminStoreTab />
          </TabsContent>

          <TabsContent value="orders" data-ocid="admin.panel">
            <AdminOrdersTab />
          </TabsContent>

          <TabsContent value="settings" data-ocid="admin.panel">
            <ChangePasswordPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ChangePasswordPanel() {
  const { actor } = useActor();
  const [step, setStep] = useState<"email" | "pin">("email");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedPin, setGeneratedPin] = useState("");

  const handleRequestPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const result = await actor?.generateResetPin(email.trim().toLowerCase());
      if (!result) {
        setMsg({
          type: "error",
          text: "That email is not registered for password recovery.",
        });
      } else {
        setGeneratedPin(result as string);
        setStep("pin");
        setMsg({
          type: "success",
          text: "PIN generated. Enter it below along with your new password.",
        });
      }
    } catch {
      setMsg({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (newPw.length < 6) {
      setMsg({
        type: "error",
        text: "New password must be at least 6 characters.",
      });
      return;
    }
    if (newPw !== confirmPw) {
      setMsg({ type: "error", text: "Passwords do not match." });
      return;
    }
    setLoading(true);
    try {
      const ok = await actor?.verifyResetPinAndChangePassword(
        pin.trim(),
        newPw,
      );
      if (ok) {
        setMsg({ type: "success", text: "Password changed successfully." });
        setStep("email");
        setEmail("");
        setPin("");
        setNewPw("");
        setConfirmPw("");
        setGeneratedPin("");
      } else {
        setMsg({
          type: "error",
          text: "Invalid or expired PIN. Please request a new one.",
        });
      }
    } catch {
      setMsg({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md">
      <h2 className="font-serif text-xl font-semibold text-foreground mb-2">
        Change Password
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Password changes require verification via the registered recovery email
        (mystoryova@gmail.com).
      </p>

      {step === "email" ? (
        <form onSubmit={handleRequestPin} className="space-y-4">
          <div>
            <label
              htmlFor="recovery-email-settings"
              className="text-sm text-muted-foreground block mb-1"
            >
              Recovery Email
            </label>
            <Input
              id="recovery-email-settings"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter recovery email"
              required
              className="bg-white/5 border-white/10"
            />
          </div>
          {msg && (
            <p
              className={`text-sm ${msg.type === "success" ? "text-green-400" : "text-destructive"}`}
            >
              {msg.text}
            </p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="bg-primary text-primary-foreground hover:brightness-110"
          >
            {loading ? "Sending..." : "Send Reset PIN"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleChangePassword} className="space-y-4">
          {generatedPin && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3 text-sm">
              <span className="text-yellow-400 font-medium">
                Your reset PIN:{" "}
              </span>
              <span className="font-mono text-lg tracking-widest">
                {generatedPin}
              </span>
              <span className="text-muted-foreground text-xs block mt-1">
                (Valid for 10 minutes)
              </span>
            </div>
          )}
          <div>
            <label
              htmlFor="settings-pin"
              className="text-sm text-muted-foreground block mb-1"
            >
              Enter PIN
            </label>
            <Input
              id="settings-pin"
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="6-digit PIN"
              required
              className="bg-white/5 border-white/10"
            />
          </div>
          <div>
            <label
              htmlFor="settings-new-pw"
              className="text-sm text-muted-foreground block mb-1"
            >
              New Password
            </label>
            <Input
              id="settings-new-pw"
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="Enter new password (min 6 chars)"
              required
              className="bg-white/5 border-white/10"
            />
          </div>
          <div>
            <label
              htmlFor="settings-confirm-pw"
              className="text-sm text-muted-foreground block mb-1"
            >
              Confirm New Password
            </label>
            <Input
              id="settings-confirm-pw"
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="Repeat new password"
              required
              className="bg-white/5 border-white/10"
            />
          </div>
          {msg && (
            <p
              className={`text-sm ${msg.type === "success" ? "text-green-400" : "text-destructive"}`}
            >
              {msg.text}
            </p>
          )}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground hover:brightness-110"
            >
              {loading ? "Saving..." : "Update Password"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStep("email");
                setMsg(null);
                setPin("");
                setNewPw("");
                setConfirmPw("");
              }}
              className="border-white/10"
            >
              Back
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
