/**
 * UI-specific types for Core Starter application
 */

import type { UserProfileDTO } from "./types";

// ============================================
// PLACEHOLDER: Custom Grid/Data Types
// ============================================

/**
 * Example: Grid cell data structure
 * Replace with your own data structure
 */
export type GridCellData = GridCellEmpty | GridCellWithEvent;

export interface GridCellEmpty {
  eventId: null;
  itemId: string;
  date: string;
}

export interface GridCellWithEvent {
  eventId: string;
  itemId: string;
  date: string;
  value: number;
}

/**
 * Example: Grid state for URL params
 * Replace with your own state structure
 */
export interface GridState {
  view: string;
  filters?: string[];
  sortField?: string;
  sortDirection?: "asc" | "desc";
}

// ============================================
// Layout Types
// ============================================

/**
 * Responsive breakpoint
 */
export type Breakpoint = "mobile" | "tablet" | "desktop";

/**
 * View mode for summary detail
 */
export type SummaryViewMode = "sidebar" | "drawer" | "standalone";

// ============================================
// User Session Types
// ============================================

/**
 * User session context
 */
export interface UserSession {
  user: UserProfileDTO | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * Subscription banner type
 */
export type SubscriptionBannerType =
  | "trial_expiring"
  | "trial_expired"
  | "subscription_expiring"
  | "subscription_expired";

// ============================================
// Cache Types
// ============================================

/**
 * Cache entry with metadata
 */
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  lastAccessed: number; // Timestamp of last access (for LRU eviction)
}

/**
 * Cache options
 */
export interface CacheOptions {
  ttl?: number; // Default: 5 minutes
  staleWhileRevalidate?: boolean; // Default: true
  retry?: number; // Retry attempts on fetch failure
}

// ============================================
// Component Props Types (PLACEHOLDER)
// ============================================

/**
 * Props for grid cell
 */
export interface GridCellProps {
  data: GridCellData;
  onClick?: () => void;
  isSelected?: boolean;
}

// ============================================
// Error Types
// ============================================

/**
 * UI Error with user-friendly message
 */
export interface UIError {
  message: string;
  code?: string;
  retry?: () => void;
}

/**
 * Loading state
 */
export type LoadingState = "idle" | "loading" | "success" | "error";
