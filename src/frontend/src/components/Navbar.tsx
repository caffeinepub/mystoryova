import { Link } from "@tanstack/react-router";
import { Heart, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useWishlist } from "../hooks/useWishlist";

const navLinks = [
  { to: "/", label: "HOME" },
  { to: "/books", label: "BOOKS" },
  { to: "/about", label: "BIO" },
  { to: "/blog", label: "INSIGHTS" },
  { to: "/contact", label: "CONTACT" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { count } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full" data-ocid="nav.section">
      <div className="glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            data-ocid="nav.link"
            className="flex items-center gap-2 shrink-0"
            aria-label="Mystoryova — Home"
          >
            <span className="font-serif text-xl font-bold tracking-wide text-foreground">
              Mystoryova
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-ocid="nav.link"
                className="text-xs tracking-[0.2em] font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                activeProps={{
                  className:
                    "text-xs tracking-[0.2em] font-medium text-primary relative group",
                }}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <Link
              to="/books"
              data-ocid="nav.link"
              className="relative p-2 text-muted-foreground hover:text-primary transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </Link>
            <button
              type="button"
              data-ocid="nav.toggle"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full glass text-muted-foreground hover:text-primary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
            <button
              type="button"
              data-ocid="nav.button"
              className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav
            className="md:hidden border-t border-white/10 px-6 py-4 flex flex-col gap-4"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-ocid="nav.link"
                onClick={() => setMobileOpen(false)}
                className="text-sm tracking-[0.15em] font-medium text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin"
              data-ocid="nav.link"
              onClick={() => setMobileOpen(false)}
              className="text-sm tracking-[0.15em] font-medium text-primary py-1"
            >
              ADMIN
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
