import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "chiddarwar_wishlist";

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = useCallback((bookId: string) => {
    setWishlist((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId],
    );
  }, []);

  const isInWishlist = useCallback(
    (bookId: string) => wishlist.includes(bookId),
    [wishlist],
  );

  return { wishlist, toggleWishlist, isInWishlist, count: wishlist.length };
}
