import sanitizeHtml from "sanitize-html";

/**
 * Sanitizes rich text produced by the admin RichTextEditor (bold/italic/lists/links/images)
 * before it's stored. Strips <script>, inline event handlers (onclick, onerror, ...),
 * javascript: URLs, and any tag/attribute not on the allow-list below.
 *
 * This does NOT apply to the ad-slot fields in Settings — those intentionally allow
 * arbitrary third-party embed codes (AdSense etc.) and are Super-Admin-only.
 */
export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["p", "br", "b", "strong", "i", "em", "u", "h1", "h2", "h3", "ul", "ol", "li", "a", "img", "blockquote", "code", "pre", "span"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height", "loading"],
      "*": ["style"],
    },
    allowedStyles: {
      "*": {
        "text-align": [/^left$/, /^right$/, /^center$/],
      },
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer nofollow", target: "_blank" }),
      img: sanitizeHtml.simpleTransform("img", { loading: "lazy" }),
    },
  });
}
