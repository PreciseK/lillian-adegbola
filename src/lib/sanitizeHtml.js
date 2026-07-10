import DOMPurify from 'dompurify';

/**
 * Sanitizes admin-authored rich text before rendering with
 * dangerouslySetInnerHTML. Allows the formatting tags/attributes our
 * WYSIWYG editor and blog markdown formatter actually produce, strips
 * everything else (script tags, event handlers, etc).
 */
export const sanitizeHtml = (html) => {
  if (!html) return '';

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'b', 'i',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'a', 'span', 'div',
      'img', 'figure', 'figcaption'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'src', 'alt', 'title']
  });
};

export default sanitizeHtml;
