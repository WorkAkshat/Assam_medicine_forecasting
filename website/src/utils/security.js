/**
 * Security & Form Handling Utility
 * Provides input sanitization (XSS prevention), regex validators,
 * and a secure submission pipeline for backend API integration.
 */

/**
 * Sanitizes user input to prevent XSS (Cross-Site Scripting)
 * Strips script tags, HTML tags, and harmful javascript: protocols.
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/javascript:/gi, '') // Strip javascript pseudo-protocol
    .replace(/[<>'"&]/g, (char) => {
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case "'": return '&#39;';
        case '"': return '&quot;';
        case '&': return '&amp;';
        default: return char;
      }
    });
}

/**
 * Validates email address format
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
  return regex.test(email.trim());
}

/**
 * Validates international and Indian phone numbers (8 to 15 digits)
 */
export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const cleanPhone = phone.trim().replace(/[\s()-]/g, '');
  // Matches e.g. +919706001000, 9706001000, 03612473924
  const regex = /^(\+?[0-9]{1,4})?[0-9]{7,14}$/;
  return regex.test(cleanPhone);
}

/**
 * Secure Form Submission Utility
 * Prepares payload with sanitized fields and communicates with backend API endpoint.
 * Includes timeout handling and mock fallback for client-only mode.
 */
export async function submitFormPayload(endpoint, rawData, timeoutMs = 8000) {
  // 1. Sanitize all string fields in payload
  const sanitizedPayload = Object.entries(rawData).reduce((acc, [key, val]) => {
    acc[key] = typeof val === 'string' ? sanitizeInput(val) : val;
    return acc;
  }, {});

  // Add client metadata
  const payload = {
    ...sanitizedPayload,
    submittedAt: new Date().toISOString(),
    sourceOrigin: window.location.origin,
    pagePath: window.location.pathname
  };

  // If a real backend endpoint is configured in env
  const apiUrl = import.meta.env.VITE_API_URL || '';
  
  if (apiUrl) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('Connection timed out. Please check your network and try again.');
      }
      throw err;
    }
  }

  // Client-side simulation fallback when backend is not yet attached
  await new Promise(resolve => setTimeout(resolve, 550));
  return {
    success: true,
    message: 'Enquiry received successfully. Our commercial desk will respond shortly.',
    data: payload
  };
}
