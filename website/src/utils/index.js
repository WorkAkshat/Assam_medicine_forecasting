/**
 * Utility functions for GRD Pharmaceuticals
 */

/**
 * Conditionally join classNames into a single string
 * @param  {...any} classes 
 * @returns {string}
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format phone number string for direct tel: links
 * @param {string} phone 
 * @returns {string}
 */
export function cleanPhone(phone) {
  return phone ? phone.replace(/[^+\d]/g, '') : '';
}
