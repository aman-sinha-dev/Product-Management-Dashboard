"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  formatPrice,
  getProducts,
  Product,
  saveProduct,
  stockLabel,
} from "@/lib/products";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

type FormState = {
  title: string;
  category: string;
  price: string;
  stock: string;
  description: string;
  brand: string;
  imageUrl: string;
};
const emptyForm: FormState = {
  title: "",
  category: "beauty",
  price: "",
  stock: "",
  description: "",
  brand: "",
  imageUrl: "",
};

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const pageSize = 8;

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setProducts(await getProducts());
    } catch {
      setError(
        "We couldn’t load the catalog. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, category, sort]);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(products.map((p) => p.category)))],
    [products],
  );

  const filtered = useMemo(
    () =>
      products
        .filter(
          (p) =>
            `${p.title} ${p.brand ?? ""} ${p.category}`
              .toLowerCase()
              .includes(debouncedQuery.toLowerCase()) &&
            (category === "all" || p.category === category),
        )
        .sort((a, b) =>
          sort === "price-low"
            ? a.price - b.price
            : sort === "price-high"
              ? b.price - a.price
              : sort === "rating"
                ? b.rating - a.rating
                : sort === "stock"
                  ? a.stock - b.stock
                  : a.id - b.id,
        ),
    [products, debouncedQuery, category, sort],
  );

  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      title: p.title,
      category: p.category,
      price: String(p.price),
      stock: String(p.stock),
      description: p.description,
      brand: p.brand ?? "",
      imageUrl: p.thumbnail,
    });
    setFormOpen(true);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.category.trim() ||
      Number(form.price) <= 0 ||
      Number(form.stock) < 0 ||
      !form.imageUrl.trim()
    )
      return notify("Complete all required fields with valid values.");
    setSaving(true);
    const optimistic = {
      ...(editing ?? {}),
      id: editing?.id ?? Date.now(),
      title: form.title.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      description: form.description.trim(),
      brand: form.brand.trim(),
      thumbnail: form.imageUrl.trim(),
      images: [form.imageUrl.trim()],
      rating: editing?.rating ?? 4.5,
      discountPercentage: editing?.discountPercentage ?? 0,
    } as Product;

    setProducts((current) =>
      editing
        ? current.map((p) => (p.id === editing.id ? optimistic : p))
        : [optimistic, ...current],
    );
    setFormOpen(false);
    notify(editing ? "Product updated" : "Product added");

    try {
      await saveProduct(
        {
          title: form.title,
          category: form.category,
          brand: form.brand,
          price: Number(form.price),
          stock: Number(form.stock),
          description: form.description,
          thumbnail: form.imageUrl,
        },
        editing?.id,
      );
    } catch {
      notify("Saved locally for this session");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Catalog management</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Products
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your full product list, edit details, and add new items.
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus data-icon="inline-start" />
          Add product
        </Button>
      </div>

      <div id="products" className="mt-8 rounded-xl border bg-card">
        <div className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">All products</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {filtered.length} products found
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative">
              <span className="sr-only">Search products</span>
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring sm:w-56"
              />
            </label>
            <select
              aria-label="Filter category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-9 cursor-pointer rounded-lg border bg-background px-3 text-sm"
            >
              <option value="all">All categories</option>
              {categories.slice(1).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              aria-label="Sort products"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-9 cursor-pointer rounded-lg border bg-background px-3 text-sm"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="rating">Rating: high to low</option>
              <option value="stock">Stock: low first</option>
            </select>
          </div>
        </div>

        {error ? (
          <div className="m-6 rounded-lg border border-destructive/30 bg-destructive/10 p-5">
            <p className="font-medium">Couldn’t load products</p>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={load}>
              <RefreshCw data-icon="inline-start" />
              Retry
            </Button>
          </div>
        ) : loading ? (
          <div className="flex flex-col gap-4 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 font-medium">No products found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Stock</th>
                    <th className="px-4 py-3 font-medium">Rating</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {visible.map((p) => (
                    <tr key={p.id} className="border-t hover:bg-muted/30">
                      <td className="px-6 py-3">
                        <button
                          className="flex cursor-pointer items-center gap-3 text-left"
                          onClick={() => router.push(`/products/${p.id}`)}
                        >
                          <img
                            src={p.thumbnail}
                            alt={p.title}
                            loading="lazy"
                            className="size-10 rounded-lg bg-muted object-cover"
                          />
                          <span>
                            <span className="block max-w-52 truncate font-medium">
                              {p.title}
                            </span>
                            <span className="block text-xs text-muted-foreground">
                              {p.brand ?? "Unbranded"}
                            </span>
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3 capitalize text-muted-foreground">
                        {p.category}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {formatPrice(p.price)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-secondary px-2 py-1 text-xs font-medium">
                          {stockLabel(p.stock)}
                        </span>
                      </td>
                      <td className="px-4 py-3">{p.rating.toFixed(1)} / 5</td>
                      <td className="px-6 py-3">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Favorite ${p.title}`}
                            onClick={() =>
                              setFavorites((f) =>
                                f.includes(p.id)
                                  ? f.filter((id) => id !== p.id)
                                  : [...f, p.id],
                              )
                            }
                          >
                            <Heart
                              className={
                                favorites.includes(p.id)
                                  ? "fill-current text-primary"
                                  : ""
                              }
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Edit ${p.title}`}
                            onClick={() => openEdit(p)}
                          >
                            <Pencil />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid gap-3 p-4 md:hidden">
              {visible.map((p) => (
                <article key={p.id} className="rounded-lg border p-4">
                  <div className="flex gap-3">
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      loading="lazy"
                      className="size-14 rounded-lg bg-muted object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-medium">{p.title}</h3>
                      <p className="text-sm capitalize text-muted-foreground">
                        {p.category} · {formatPrice(p.price)}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {stockLabel(p.stock)} · {p.rating.toFixed(1)} rating
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/products/${p.id}`)}
                    >
                      View details
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEdit(p)}
                    >
                      Edit
                    </Button>
                  </div>
                </article>
              ))}
            </div>
            <div className="flex items-center justify-between border-t p-4">
              <p className="text-sm text-muted-foreground">
                Page {page} of {pages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft data-icon="inline-start" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === pages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                  <ChevronRight data-icon="inline-end" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 p-4">
          <form
            onSubmit={submit}
            className="max-h-[92vh] w-full max-w-lg overflow-auto rounded-2xl border bg-card p-6 shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  {editing ? "Edit product" : "Add product"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Required fields are marked by the browser.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close form"
                onClick={() => setFormOpen(false)}
              >
                <X />
              </Button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="text-sm font-medium">Product name</span>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm"
                />
              </label>
              <label>
                <span className="text-sm font-medium">Category</span>
                <input
                  required
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm"
                />
              </label>
              <label>
                <span className="text-sm font-medium">Brand</span>
                <input
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm"
                />
              </label>
              <label>
                <span className="text-sm font-medium">Price</span>
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm"
                />
              </label>
              <label>
                <span className="text-sm font-medium">Stock quantity</span>
                <input
                  required
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm"
                />
              </label>
              <label className="sm:col-span-2">
                <span className="text-sm font-medium">Product image URL</span>
                <input
                  required
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({ ...form, imageUrl: e.target.value })
                  }
                  placeholder="https://..."
                  className="mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm"
                />
              </label>
              <label className="sm:col-span-2">
                <span className="text-sm font-medium">Description</span>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border bg-background p-3 text-sm"
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setForm(emptyForm)}
              >
                Reset
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setFormOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : editing ? "Save changes" : "Add product"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 rounded-lg border bg-card px-4 py-3 text-sm font-medium shadow-lg"
        >
          {notice}
        </div>
      )}
    </div>
  );
}
