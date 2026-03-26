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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Headphones,
  Pencil,
  Plus,
  ShoppingBag,
  Trash2,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { AudiobookProduct, MerchProduct } from "../hooks/useStore";
import { useStore } from "../hooks/useStore";

const MERCH_CATEGORIES = [
  "T-Shirt",
  "Hoodie",
  "Mug",
  "Poster",
  "Tote Bag",
  "Other",
];

const EMPTY_MERCH: Omit<MerchProduct, "id"> = {
  title: "",
  description: "",
  price: 2500,
  imageUrl: "",
  category: "T-Shirt",
  inStock: true,
  featured: false,
  sizes: [],
  stockBySize: {},
};

const SIZED_CATEGORIES = ["T-Shirt", "Hoodie"];
const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const EMPTY_AUDIO: Omit<AudiobookProduct, "id"> = {
  bookId: "0",
  title: "",
  description: "",
  price: 1499,
  sampleUrl: "",
  fullAudioUrl: "",
  duration: "",
  coverUrl: "",
  narrator: "",
};

/** Read a file as a base64 data URL */
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Small reusable file-upload row */
function FileUploadField({
  label,
  accept,
  value,
  onChange,
  hint,
}: {
  label: string;
  accept: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      onChange(dataUrl);
      toast.success(`"${file.name}" loaded`);
    } catch {
      toast.error("Failed to read file.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const isDataUrl = value.startsWith("data:");

  return (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-2 mt-1">
        <Input
          data-ocid="admin.input"
          value={isDataUrl ? "" : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            isDataUrl ? "(file uploaded from device)" : "https://..."
          }
          className="bg-muted/30 border-white/10 flex-1"
          disabled={isDataUrl}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10 whitespace-nowrap"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="w-3.5 h-3.5" />
          {uploading ? "Loading..." : "Upload"}
        </Button>
        {isDataUrl && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => onChange("")}
          >
            Remove
          </Button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFile}
      />
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      {isDataUrl && (
        <p className="text-xs text-green-400 mt-1">✓ File loaded from device</p>
      )}
    </div>
  );
}

function MerchForm({
  product,
  onSave,
  onClose,
}: {
  product?: MerchProduct;
  onSave: (p: MerchProduct | Omit<MerchProduct, "id">) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<MerchProduct, "id">>(
    product ? { ...product } : { ...EMPTY_MERCH },
  );
  const set =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

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
        <Label>Price (in cents, e.g. 2499 = $24.99)</Label>
        <Input
          data-ocid="admin.input"
          type="number"
          value={form.price}
          onChange={(e) =>
            setForm((p) => ({ ...p, price: Number(e.target.value) }))
          }
          className="mt-1 bg-muted/30 border-white/10"
        />
        <p className="text-xs text-muted-foreground mt-1">
          = ${(form.price / 100).toFixed(2)}
        </p>
      </div>
      <FileUploadField
        label="Product Image"
        accept="image/*"
        value={form.imageUrl}
        onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
        hint="Upload from device or paste a URL"
      />
      <div>
        <Label>Category</Label>
        <Select
          value={form.category || "T-Shirt"}
          onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
        >
          <SelectTrigger
            data-ocid="admin.select"
            className="mt-1 bg-muted/30 border-white/10"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MERCH_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-3">
        <Switch
          checked={form.inStock}
          onCheckedChange={(v) => setForm((p) => ({ ...p, inStock: v }))}
          data-ocid="admin.switch"
        />
        <Label>In Stock</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch
          checked={form.featured}
          onCheckedChange={(v) => setForm((p) => ({ ...p, featured: v }))}
          data-ocid="admin.switch"
        />
        <Label>Featured</Label>
      </div>
      {SIZED_CATEGORIES.includes(form.category) && (
        <div className="space-y-3 border-t border-white/10 pt-3">
          <Label className="text-sm font-medium">Stock by Size</Label>
          <div className="grid grid-cols-3 gap-2">
            {ALL_SIZES.map((size) => (
              <div key={size}>
                <Label
                  htmlFor={`size-stock-${size}`}
                  className="text-xs text-muted-foreground block mb-1"
                >
                  {size}
                </Label>
                <Input
                  id={`size-stock-${size}`}
                  type="number"
                  min={0}
                  data-ocid="admin.input"
                  value={form.stockBySize?.[size] ?? 0}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      stockBySize: {
                        ...(p.stockBySize ?? {}),
                        [size]: Number(e.target.value),
                      },
                    }))
                  }
                  className="bg-muted/30 border-white/10 text-xs h-8"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex gap-3 pt-2">
        <Button
          data-ocid="admin.save_button"
          onClick={() => onSave(product ? { ...product, ...form } : form)}
          className="bg-primary text-primary-foreground hover:brightness-110"
        >
          Save Product
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

function AudiobookForm({
  ab,
  onSave,
  onClose,
}: {
  ab?: AudiobookProduct;
  onSave: (a: AudiobookProduct | Omit<AudiobookProduct, "id">) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<AudiobookProduct, "id">>(
    ab ? { ...ab } : { ...EMPTY_AUDIO },
  );
  const set =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

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
        <Label>Narrator</Label>
        <Input
          data-ocid="admin.input"
          value={form.narrator}
          onChange={set("narrator")}
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
        <Label>Price (in cents, e.g. 1499 = $14.99)</Label>
        <Input
          data-ocid="admin.input"
          type="number"
          value={form.price}
          onChange={(e) =>
            setForm((p) => ({ ...p, price: Number(e.target.value) }))
          }
          className="mt-1 bg-muted/30 border-white/10"
        />
        <p className="text-xs text-muted-foreground mt-1">
          = ${(form.price / 100).toFixed(2)}
        </p>
      </div>
      <div>
        <Label>Duration (e.g. 6h 42m)</Label>
        <Input
          data-ocid="admin.input"
          value={form.duration}
          onChange={set("duration")}
          placeholder="6h 42m"
          className="mt-1 bg-muted/30 border-white/10"
        />
      </div>

      <FileUploadField
        label="Cover Image"
        accept="image/*"
        value={form.coverUrl}
        onChange={(url) => setForm((p) => ({ ...p, coverUrl: url }))}
        hint="Upload from device or paste a URL"
      />

      <div className="border-t border-white/10 pt-4">
        <p className="text-xs tracking-widest text-primary font-semibold mb-3">
          AUDIO FILES
        </p>
        <div className="space-y-4">
          <FileUploadField
            label="Sample Audio (public preview)"
            accept="audio/*"
            value={form.sampleUrl}
            onChange={(url) => setForm((p) => ({ ...p, sampleUrl: url }))}
            hint="Short clip played before purchase. MP3 recommended, keep under 5 MB."
          />
          <FileUploadField
            label="Full Audiobook (post-purchase)"
            accept="audio/*"
            value={form.fullAudioUrl}
            onChange={(url) => setForm((p) => ({ ...p, fullAudioUrl: url }))}
            hint="Full file accessed after purchase. MP3/M4B recommended. Large files may be slow to load in-browser — a hosting URL is better for files over 50 MB."
          />
        </div>
      </div>

      <div>
        <Label>Book ID (0 = standalone)</Label>
        <Input
          data-ocid="admin.input"
          value={form.bookId}
          onChange={set("bookId")}
          className="mt-1 bg-muted/30 border-white/10"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <Button
          data-ocid="admin.save_button"
          onClick={() => onSave(ab ? { ...ab, ...form } : form)}
          className="bg-primary text-primary-foreground hover:brightness-110"
        >
          Save Audiobook
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

export default function AdminStoreTab() {
  const {
    merch,
    audiobooks,
    addMerch,
    updateMerch,
    deleteMerch,
    addAudiobook,
    updateAudiobook,
    deleteAudiobook,
  } = useStore();

  const [merchDialogOpen, setMerchDialogOpen] = useState(false);
  const [editingMerch, setEditingMerch] = useState<MerchProduct | undefined>();
  const [audioDialogOpen, setAudioDialogOpen] = useState(false);
  const [editingAudio, setEditingAudio] = useState<
    AudiobookProduct | undefined
  >();

  const handleSaveMerch = (p: MerchProduct | Omit<MerchProduct, "id">) => {
    if ("id" in p) {
      updateMerch(p.id, p);
      toast.success("Product updated");
    } else {
      addMerch(p);
      toast.success("Product created");
    }
    setMerchDialogOpen(false);
    setEditingMerch(undefined);
  };

  const handleSaveAudio = (
    a: AudiobookProduct | Omit<AudiobookProduct, "id">,
  ) => {
    if ("id" in a) {
      updateAudiobook(a.id, a);
      toast.success("Audiobook updated");
    } else {
      addAudiobook(a);
      toast.success("Audiobook created");
    }
    setAudioDialogOpen(false);
    setEditingAudio(undefined);
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="merch">
        <TabsList className="glass border border-white/10 mb-6">
          <TabsTrigger value="merch" data-ocid="admin.tab">
            <ShoppingBag className="w-3.5 h-3.5 mr-1.5" /> Merchandise
          </TabsTrigger>
          <TabsTrigger value="audiobooks" data-ocid="admin.tab">
            <Headphones className="w-3.5 h-3.5 mr-1.5" /> Audiobooks
          </TabsTrigger>
        </TabsList>

        {/* Merchandise */}
        <TabsContent value="merch" data-ocid="admin.panel">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif text-lg font-semibold text-foreground">
              Merchandise Products ({merch.length})
            </h3>
            <Dialog open={merchDialogOpen} onOpenChange={setMerchDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  data-ocid="admin.open_modal_button"
                  onClick={() => setEditingMerch(undefined)}
                  className="bg-primary text-primary-foreground hover:brightness-110 gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg glass border border-white/15">
                <DialogHeader>
                  <DialogTitle className="font-serif">
                    {editingMerch ? "Edit Product" : "New Product"}
                  </DialogTitle>
                </DialogHeader>
                <MerchForm
                  product={editingMerch}
                  onSave={handleSaveMerch}
                  onClose={() => {
                    setMerchDialogOpen(false);
                    setEditingMerch(undefined);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
          <div className="glass rounded-2xl overflow-hidden">
            <Table data-ocid="admin.table">
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {merch.map((p, i) => (
                  <TableRow
                    key={p.id}
                    data-ocid={`admin.row.${i + 1}`}
                    className="border-white/10"
                  >
                    <TableCell className="font-medium text-foreground">
                      {p.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {p.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      ${(p.price / 100).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {p.inStock ? (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                          In Stock
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          Out of Stock
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {p.featured ? (
                        <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                          Yes
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          data-ocid={`admin.edit_button.${i + 1}`}
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingMerch(p);
                            setMerchDialogOpen(true);
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
                            deleteMerch(p.id);
                            toast.success("Product deleted");
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {merch.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground py-10"
                      data-ocid="admin.empty_state"
                    >
                      No products yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Audiobooks */}
        <TabsContent value="audiobooks" data-ocid="admin.panel">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif text-lg font-semibold text-foreground">
              Audiobooks ({audiobooks.length})
            </h3>
            <Dialog open={audioDialogOpen} onOpenChange={setAudioDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  data-ocid="admin.open_modal_button"
                  onClick={() => setEditingAudio(undefined)}
                  className="bg-primary text-primary-foreground hover:brightness-110 gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Audiobook
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg glass border border-white/15">
                <DialogHeader>
                  <DialogTitle className="font-serif">
                    {editingAudio ? "Edit Audiobook" : "New Audiobook"}
                  </DialogTitle>
                </DialogHeader>
                <AudiobookForm
                  ab={editingAudio}
                  onSave={handleSaveAudio}
                  onClose={() => {
                    setAudioDialogOpen(false);
                    setEditingAudio(undefined);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
          <div className="glass rounded-2xl overflow-hidden">
            <Table data-ocid="admin.table">
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead>Title</TableHead>
                  <TableHead>Narrator</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {audiobooks.map((ab, i) => (
                  <TableRow
                    key={ab.id}
                    data-ocid={`admin.row.${i + 1}`}
                    className="border-white/10"
                  >
                    <TableCell className="font-medium text-foreground">
                      {ab.title}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {ab.narrator}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {ab.duration}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      ${(ab.price / 100).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          data-ocid={`admin.edit_button.${i + 1}`}
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingAudio(ab);
                            setAudioDialogOpen(true);
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
                            deleteAudiobook(ab.id);
                            toast.success("Audiobook deleted");
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {audiobooks.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-10"
                      data-ocid="admin.empty_state"
                    >
                      No audiobooks yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
