import { Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { SiFacebook, SiInstagram } from "react-icons/si";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  );
  return (
    <footer
      className="border-t border-white/10 bg-background"
      data-ocid="footer.section"
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center mb-4">
              <span className="font-serif text-2xl font-bold tracking-wide text-foreground">
                Mystoryova
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mt-2">
              Official website of O. Chiddarwar.
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              mystoryova@gmail.com
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs tracking-[0.2em] text-primary font-semibold mb-4">
              EXPLORE
            </h4>
            <nav className="flex flex-col gap-2">
              {["/", "/books", "/about", "/blog", "/contact"].map((path, i) => {
                const labels = ["Home", "Books", "About", "Blog", "Contact"];
                return (
                  <Link
                    key={path}
                    to={path}
                    data-ocid="footer.link"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {labels[i]}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Store */}
          <div>
            <h4 className="text-xs tracking-[0.2em] text-primary font-semibold mb-4">
              STORE
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                to="/store"
                data-ocid="footer.link"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                All Products
              </Link>
              <Link
                to="/store"
                data-ocid="footer.link"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Audiobooks
              </Link>
              <Link
                to="/store"
                data-ocid="footer.link"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Merchandise
              </Link>
              <Link
                to="/store/library"
                data-ocid="footer.link"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                My Library
              </Link>
              <Link
                to="/store/orders"
                data-ocid="footer.link"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Track Order
              </Link>
            </nav>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs tracking-[0.2em] text-primary font-semibold mb-4">
              CONNECT
            </h4>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/mystoryova?igsh=MW9zZjdscWtodXpwNg=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SiInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/share/18R1ypxq4q/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SiFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.amazon.com/author/o.chiddarwar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Amazon Author Page"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <BookOpen className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {year} Mystoryova. All rights reserved.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link
              to="/privacy-policy"
              data-ocid="footer.link"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-muted-foreground/40 text-xs">·</span>
            <Link
              to="/terms"
              data-ocid="footer.link"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Terms &amp; Conditions
            </Link>
            <span className="text-muted-foreground/40 text-xs">·</span>
            <Link
              to="/return-policy"
              data-ocid="footer.link"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Return Policy
            </Link>
          </div>
          <p className="text-muted-foreground text-sm">
            Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
