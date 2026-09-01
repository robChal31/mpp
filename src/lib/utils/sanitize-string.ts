// lib/utils/sanitize.ts

/**
 * Decode HTML entities to normal characters
 * Example: "Daarul Qur&#39;an" -> "Daarul Qur'an"
 */
export const decodeHTMLEntities = (str: string | null | undefined): string => {
  if (!str) return '';
  
  return str
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
};

/**
 * Sanitize string for display - decode entities + trim + normalize spaces
 */
export const sanitizeDisplay = (str: string | null | undefined): string => {
  if (!str) return '';
  
  return decodeHTMLEntities(str)
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/^[\dA-Za-z]+[\.\)]\s*/, '');
};

/**
 * Sanitize string for URL/slug
 */
export const sanitizeSlug = (str: string | null | undefined): string => {
  if (!str) return '';
  
  return decodeHTMLEntities(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

/**
 * Sanitize string for form input (allow specific characters)
 */
export const sanitizeFormInput = (str: string | null | undefined): string => {
  if (!str) return '';
  
  return decodeHTMLEntities(str)
    .replace(/[^a-zA-Z0-9\s\-'&()_.:,]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
};

/**
 * Sanitize string for filename
 */
export const sanitizeFilename = (str: string | null | undefined): string => {
  if (!str) return '';
  
  return decodeHTMLEntities(str)
    .replace(/[^a-zA-Z0-9\-_. ]/g, '')
    .trim();
};

/**
 * Escape HTML to prevent XSS
 */
export const escapeHTML = (str: string | null | undefined): string => {
  if (!str) return '';
  
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
  };
  
  return str.replace(/[&<>"'/]/g, (char) => map[char] || char);
};

/**
 * Check if string contains HTML entities
 */
export const hasHTMLEntities = (str: string | null | undefined): boolean => {
  if (!str) return false;
  return /&[#\w]+;/.test(str);
};

/**
 * Extract all HTML entities from string
 */
export const extractHTMLEntities = (str: string | null | undefined): string[] => {
  if (!str) return [];
  return str.match(/&[#\w]+;/g) || [];
};

/**
 * Sanitize array of strings
 */
export const sanitizeArray = (arr: (string | null | undefined)[]): string[] => {
  return arr.map(item => sanitizeDisplay(item)).filter(Boolean);
};



// Utility function khusus buat API response
export const sanitizeAPIResponse = <T>(data: T): T => {
  if (!data) return data;
  
  if (typeof data === 'string') {
    return sanitizeDisplay(data) as T;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeAPIResponse(item)) as T;
  }
  
  if (data && typeof data === 'object') {
    const result: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key];
        if (typeof value === 'string') {
          result[key] = sanitizeDisplay(value);
        } else if (Array.isArray(value)) {
          result[key] = value.map(item => sanitizeAPIResponse(item));
        } else if (value && typeof value === 'object') {
          result[key] = sanitizeAPIResponse(value);
        } else {
          result[key] = value;
        }
      }
    }
    return result;
  }
  
  return data;
};