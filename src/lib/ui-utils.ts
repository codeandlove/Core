/**
 * UI Utility Functions
 * Core Starter - General purpose utilities for UI components
 */

/**
 * Format percent change with sign
 */
export function formatPercentChange(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Format date to readable format
 */
export function formatDate(dateString: string, locale = "pl-PL"): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format date to short format
 */
export function formatDateShort(dateString: string, locale = "pl-PL"): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });
}

/**
 * Format currency (PLN)
 */
export function formatCurrency(value: number, locale = "pl-PL"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "PLN",
  }).format(value);
}

/**
 * Format number with thousand separators
 */
export function formatNumber(value: number, locale = "pl-PL"): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Dziś";
  if (diffDays === 1) return "Wczoraj";
  if (diffDays < 7) return `${diffDays} dni temu`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tygodni temu`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} miesięcy temu`;
  return `${Math.floor(diffDays / 365)} lat temu`;
}

/**
 * Calculate days remaining
 */
export function daysRemaining(dateString: string | null): number | null {
  if (!dateString) return null;
  const targetDate = new Date(dateString);
  const today = new Date();
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Get subscription status label
 */
export function getSubscriptionStatusLabel(status: string): string {
  switch (status) {
    case "trial":
      return "Trial";
    case "active":
      return "Aktywna";
    case "past_due":
      return "Zaległość w płatnościach";
    case "canceled":
      return "Anulowana";
    case "expired":
      return "Wygasła";
    default:
      return "Nieznany";
  }
}

/**
 * Get subscription status color
 */
export function getSubscriptionStatusColor(status: string): string {
  switch (status) {
    case "trial":
      return "text-blue-700 bg-blue-100 border-blue-300";
    case "active":
      return "text-green-700 bg-green-100 border-green-300";
    case "past_due":
      return "text-orange-700 bg-orange-100 border-orange-300";
    case "canceled":
    case "expired":
      return "text-red-700 bg-red-100 border-red-300";
    default:
      return "text-gray-700 bg-gray-100 border-gray-300";
  }
}

/**
 * Debounce function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ============================================
// PLACEHOLDER: Add your custom UI utilities here
// ============================================

/**
 * Example: Get status badge color
 *
 * export function getStatusColor(status: string): string {
 *   switch (status) {
 *     case "active": return "bg-green-100 text-green-800";
 *     case "pending": return "bg-yellow-100 text-yellow-800";
 *     case "inactive": return "bg-gray-100 text-gray-800";
 *     default: return "bg-gray-100 text-gray-800";
 *   }
 * }
 */
