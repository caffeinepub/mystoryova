import { useEffect } from "react";

interface MetaTagsOptions {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
}

export function useMetaTags({
  title,
  description,
  ogImage,
  ogType = "website",
}: MetaTagsOptions) {
  useEffect(() => {
    const siteName = "O. Chiddarwar";
    const fullTitle = title
      ? `${title} — ${siteName}`
      : `${siteName} — Stories That Haunt. Truths That Heal.`;
    const desc =
      description ||
      "Official author website of O. Chiddarwar — psychological and emotional storytelling.";
    const image =
      ogImage ||
      `${window.location.origin}/assets/generated/book-echo-chamber.dim_400x600.jpg`;

    document.title = fullTitle;

    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(
        `meta[${attr}="${name}"]`,
      ) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta("description", desc);
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", desc, true);
    setMeta("og:image", image, true);
    setMeta("og:type", ogType, true);
    setMeta("twitter:card", ogImage ? "summary_large_image" : "summary");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", desc);
  }, [title, description, ogImage, ogType]);
}
