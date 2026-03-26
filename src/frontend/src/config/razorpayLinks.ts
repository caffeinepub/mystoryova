/**
 * Razorpay Payment Links Configuration
 *
 * These are static payment link URLs generated from the Razorpay dashboard.
 * NO backend API or SDK is used — clicking a Buy Now button simply opens
 * the hosted Razorpay checkout page in a new tab.
 *
 * HOW TO UPDATE:
 * 1. Log in to your Razorpay dashboard → Payment Links → Create Link
 * 2. Copy the link URL (e.g. https://rzp.io/l/your-link-id)
 * 3. Replace the "#" placeholder for the matching product title below
 */

/** Razorpay payment links for audiobooks, keyed by exact product title. */
export const RAZORPAY_AUDIOBOOK_LINKS: Record<string, string> = {
  "The Ember Prophecy": "#", // Replace with actual Razorpay link
  "The Long Climb": "#", // Replace with actual Razorpay link
  "The Letter in the Rain": "#", // Replace with actual Razorpay link
};

/** Razorpay payment links for merchandise, keyed by exact product title. */
export const RAZORPAY_MERCH_LINKS: Record<string, string> = {
  // Add merch product titles here when links are available
  // "Mystoryova Tote Bag": "#",
  // "Mystoryova T-Shirt": "#",
};

/**
 * Fallback link used when a product title is not found in the maps above.
 * Replace with a generic Razorpay payment page if desired.
 */
export const RAZORPAY_DEFAULT_LINK = "#";
