# Mystoryova — Merchandise & Audiobook Feature Additions

## Current State
- Store has `/store`, `/store/merch/:id`, `/store/audiobooks/:id`, `/store/cart`, `/store/success`, `/store/library` pages
- MerchProduct has: id, title, description, price, imageUrl, category, inStock (boolean), featured
- AudiobookProduct has: id, bookId, title, description, price, sampleUrl, fullAudioUrl, duration, coverUrl, narrator
- AudioPlayer component: play/pause, seek, volume, but no speed control or progress memory
- MerchDetailPage: basic add-to-cart, no size/variant selection
- CartPage: quantity controls, shipping address, Stripe checkout
- No order lookup for customers
- No ratings/reviews on store products
- No related products section
- Wishlist exists for books but not wired to store items

## Requested Changes (Diff)

### Add
- **Size/variant selector** on merch products that are apparel (T-Shirt, Hoodie). Sizes: XS, S, M, L, XL, XXL. Selected size stored in cart item. Size chart tooltip next to selector.
- **Stock quantity per variant** — MerchProduct gets `stockBySize: Record<string, number>` for apparel items. Admin can set quantity per size.
- **Playback speed control** in AudioPlayer (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x) — shown as a small button that cycles speeds.
- **Audiobook progress tracking** — save last playback position to localStorage per audiobook ID. On re-open, offer to resume from last position.
- **Customer star ratings** for merch and audiobooks — simple 1–5 star display with count. Stored in localStorage. Customers can leave a rating after purchase (detected by email in orders).
- **Order lookup page** `/store/orders` — customer enters email, sees their order history with items, status, date. Linked from footer and order success page.
- **Related products section** on MerchDetailPage ("You May Also Like" — 3 other merch items from same/similar category) and AudiobookDetailPage (3 other audiobooks).
- **Book + Audiobook bundle suggestion** on AudiobookDetailPage — if a matching book exists (same title), show a bundle callout linking to the book's Amazon page.
- **Admin: size stock management** — in AdminStoreTab merch editing, show per-size stock quantity inputs for apparel categories.

### Modify
- `MerchProduct` interface: add optional `sizes: string[]` and `stockBySize: Record<string, number>` fields.
- `CartItem` interface (useCart): add optional `selectedSize?: string` field.
- `AudioPlayer` component: add speed control button, add `audiobookId?: string` prop for progress tracking, show resume banner if saved progress found.
- `MerchDetailPage`: add size selector UI before Add to Cart button for apparel categories. Block checkout if size not selected.
- `AudiobookDetailPage`: add related audiobooks section at the bottom. Add bundle callout if matching book found in books data.
- `CartPage`: show selected size in cart item display.
- Footer and OrderSuccessPage: add link to `/store/orders`.

### Remove
- Nothing removed.

## Implementation Plan
1. Update `MerchProduct` and `CartItem` interfaces in `useStore.tsx` and `useCart.tsx`.
2. Update `AudioPlayer.tsx` — add speed control (cycle through speeds on click), add `audiobookId` prop, save/restore progress via localStorage, show resume toast/banner.
3. Update `MerchDetailPage.tsx` — add size selector for T-Shirt/Hoodie, size chart tooltip, block add-to-cart without size. Add related products section.
4. Update `AudiobookDetailPage.tsx` — add related audiobooks section. Add book+audiobook bundle callout.
5. Update `CartPage.tsx` — show selected size in cart item line.
6. Update `AdminStoreTab.tsx` — add per-size stock quantity inputs for apparel merch.
7. Create `/store/orders` page — email input, order lookup from StoreContext, display order cards with status/items.
8. Add simple star rating component — displayed on product pages, persisted in localStorage.
9. Update App.tsx routing to include `/store/orders`.
10. Update Footer to link to Order Lookup.
