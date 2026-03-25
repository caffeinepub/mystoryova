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
import {
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { BlogPost, Book } from "../backend";
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

const EMPTY_BOOK: Omit<Book, "id"> = {
  title: "",
  subtitle: "",
  description: "",
  genres: [],
  formats: [],
  coverUrl: "",
  amazonLink: "",
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

function LoginForm() {
  const { login } = useAdmin();
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(password)) {
      setError("Incorrect password.");
    } else setError("");
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
      <div>
        <Label>Cover URL</Label>
        <Input
          data-ocid="admin.input"
          value={form.coverUrl}
          onChange={set("coverUrl")}
          className="mt-1 bg-muted/30 border-white/10"
        />
      </div>
      <div>
        <Label>Amazon Link</Label>
        <Input
          data-ocid="admin.input"
          value={form.amazonLink}
          onChange={set("amazonLink")}
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
                              onClick={() =>
                                deleteBook.mutate(book.id, {
                                  onSuccess: () =>
                                    toast.success("Book deleted"),
                                  onError: () => toast.error("Failed"),
                                })
                              }
                            >
                              {deleteBook.isPending ? (
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
                              onClick={() =>
                                deletePost.mutate(post.id, {
                                  onSuccess: () => toast.success("Deleted"),
                                  onError: () => toast.error("Failed"),
                                })
                              }
                            >
                              {deletePost.isPending ? (
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
        </Tabs>
      </div>
    </div>
  );
}
