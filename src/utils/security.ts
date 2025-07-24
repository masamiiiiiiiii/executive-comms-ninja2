// Security utilities for input sanitization and validation

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export const sanitizeHtml = (html: string): string => {
  // Create a temporary div to safely parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.textContent = html;
  return tempDiv.innerHTML;
};

/**
 * Validates and sanitizes CSS properties for safe injection
 */
export const sanitizeCssProperty = (property: string, value: string): string | null => {
  // Allow only safe CSS properties and values
  const safeCssProperties = ['color', 'background-color', 'border-color'];
  const cssColorPattern = /^(#[0-9a-fA-F]{3,6}|rgb\([0-9,\s]+\)|rgba\([0-9,\s,\.]+\)|hsl\([0-9,\s,%]+\)|hsla\([0-9,\s,%,\.]+\))$/;
  
  if (!safeCssProperties.includes(property)) {
    return null;
  }
  
  if (!cssColorPattern.test(value.trim())) {
    return null;
  }
  
  return `${property}: ${value.trim()};`;
};

/**
 * Creates secure cookies with proper flags
 */
export const setSecureCookie = (name: string, value: string, options: {
  maxAge?: number;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
} = {}): void => {
  const {
    maxAge = 30 * 24 * 60 * 60, // 30 days default
    path = '/',
    secure = window.location.protocol === 'https:',
    sameSite = 'Lax'
  } = options;

  let cookieString = `${name}=${encodeURIComponent(value)}`;
  cookieString += `; Path=${path}`;
  cookieString += `; Max-Age=${maxAge}`;
  cookieString += `; SameSite=${sameSite}`;
  
  if (secure) {
    cookieString += '; Secure';
  }

  document.cookie = cookieString;
};

/**
 * Validates input against common injection patterns
 */
export const validateInput = (input: string): boolean => {
  // Check for common injection patterns
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:text\/html/gi
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(input));
};

/**
 * Generates a secure random token
 */
export const generateSecureToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};