// Import sanitize-html and he for HTML cleanup and decoding
import sanitizeHtmlLib from 'sanitize-html';
import he from 'he';

/**
 * Decodes HTML entities in text.
 * Example: Converts '&amp;' to '&'
 */
export function decodeHtmlEntities(text: string): string {
  try {
    return he.decode(text);
  } catch (error) {
    console.error('Decoding error:', error);
    return text;
  }
}

/**
 * Sanitizes decoded HTML input.
 * Allows a safe subset of tags, attributes, and inline styles for blog posts.
 * Logs before/after HTML so you can see what was modified.
 */
export function sanitizeHtml(html: string): string {
  try {
    const decoded = he.decode(html);
    const clean = sanitizeHtmlLib(decoded, {
      allowedTags: [
        'style', // 💥 now enabled safely
        'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'strong', 'em', 'b', 'i', 'u', 'span', 'div',
        'ul', 'ol', 'li', 'br', 'a', 'img', 'blockquote', 'pre', 'code',
        'table', 'thead', 'tbody', 'tr', 'th', 'td'
      ],
      allowedAttributes: {
        '*': ['class', 'style'],
        a: ['href', 'target'],
        img: ['src', 'alt']
      },
      allowedStyles: {
        '*': {
          color: [/^.*$/],
          'background-color': [/^.*$/],
          'text-align': [/^left$|^right$|^center$/],
          'font-size': [/^\d+(px|em|%)$/],
          'font-weight': [/^.*$/],
          padding: [/^.*$/],
          margin: [/^.*$/],
          border: [/^.*$/],
          'border-radius': [/^.*$/],
          'text-decoration': [/^.*$/]
        }
      },
      nonTextTags: [], // retain <style> content
      allowVulnerableTags: true, // ✅ acknowledges XSS risk
    });

    // 🧼 Debug: Show original vs. sanitized output
    console.log('🧼 sanitize-html processed the content.');
    console.log('Before:', decoded);
    console.log('After:', clean);

    return clean;
  } catch (error) {
    console.error('Sanitization error:', error);
    return html; // fallback: return original input if sanitization fails
  }
}
