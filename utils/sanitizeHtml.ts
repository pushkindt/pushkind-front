/**
 * @file sanitizeHtml.ts removes unsafe tags/attributes before the description is rendered.
 */

const FORBIDDEN_TAGS = new Set([
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "link",
  "base",
]);

const isJsScheme = (value: string): boolean => {
  return value.trim().toLowerCase().startsWith("javascript:");
};

const sanitizeElement = (element: Element): void => {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  const tagName = element.tagName.toLowerCase();
  if (FORBIDDEN_TAGS.has(tagName)) {
    element.remove();
    return;
  }

  Array.from(element.attributes).forEach((attr) => {
    const attrName = attr.name.toLowerCase();
    if (attrName.startsWith("on") || isJsScheme(attr.value)) {
      element.removeAttribute(attr.name);
    }
  });

  Array.from(element.children).forEach((child) => {
    sanitizeElement(child);
  });
};

/**
 * Strip disallowed tags and attributes from HTML content to keep innerHTML rendering safe.
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) {
    return "";
  }

  if (
    typeof window === "undefined" ||
    typeof window.DOMParser === "undefined"
  ) {
    return html;
  }

  const parser = new window.DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  sanitizeElement(doc.body);
  return doc.body.innerHTML;
};
