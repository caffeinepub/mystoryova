import { Link } from "@tanstack/react-router";
import { SiGoodreads, SiInstagram, SiLinkedin, SiX } from "react-icons/si";

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3 mb-4">
              <img
                src="/assets/generated/mystoryova-logo-primary.dim_1200x600.png"
                alt="Mystoryova"
                className="h-16 w-auto object-contain"
              />
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

          {/* Social */}
          <div>
            <h4 className="text-xs tracking-[0.2em] text-primary font-semibold mb-4">
              CONNECT
            </h4>
            <div className="flex gap-4">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SiX className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SiInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://goodreads.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Goodreads"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SiGoodreads className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SiLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {year} Mystoryova. All rights reserved.
          </p>
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
