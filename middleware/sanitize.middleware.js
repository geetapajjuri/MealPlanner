/**
 * Sanitization Middleware
 * Cleans and sanitizes user inputs to prevent XSS and injection attacks
 */

/**
 * Sanitize all incoming request data
 */
function sanitizeInputs(req, res, next) {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  
  next();
}

/**
 * Recursively sanitize an object
 * @param {*} obj - Object to sanitize
 * @returns {*} Sanitized object
 */
function sanitizeObject(obj) {
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj
      .filter(item => item !== null && item !== undefined && item !== '')
      .map(item => sanitizeObject(item));
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }
  
  return obj;
}

/**
 * Sanitize a string
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  
  // Trim whitespace
  str = str.trim();
  
  // Basic XSS protection: escape HTML characters
  str = str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
  
  return str;
}

module.exports = {
  sanitizeInputs,
};
