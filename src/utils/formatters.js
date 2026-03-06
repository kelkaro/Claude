/**
 * Shared formatting utilities for the TravelDeal UI.
 */

/**
 * Format a price in EUR.
 * @param {number} amount
 * @returns {string} e.g. "489 €"
 */
export function formatPrice(amount) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format an ISO date string to a readable date.
 */
export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format an ISO date string to a time.
 * @param {string} iso
 * @returns {string} e.g. "08:30"
 */
export function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Render star rating as a string of filled/empty stars.
 * @param {number} count - 1 to 5
 * @returns {string}
 */
export function renderStars(count) {
  return '★'.repeat(count) + '☆'.repeat(5 - count);
}

/**
 * Returns a rating label based on numeric score.
 * @param {number} score - 0 to 10
 * @returns {string}
 */
export function ratingLabel(score) {
  if (score >= 9) return 'Exceptionnel';
  if (score >= 8) return 'Excellent';
  if (score >= 7) return 'Très bien';
  if (score >= 6) return 'Bien';
  return 'Correct';
}
