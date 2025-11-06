/**
 * Admin Utilities
 * 
 * Common utility functions used across admin components
 * Centralizes reusable logic to avoid code duplication
 */

/**
 * Status color mappings for consistent UI across admin
 */
export const STATUS_COLORS = {
  // Order Status Colors
  order: {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-blue-900/30 dark:text-blue-300',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    delivered: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  },
  
  // Payment Status Colors
  payment: {
    paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-blue-900/30 dark:text-blue-300',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    refunded: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  },
  
  // User Role Colors
  role: {
    admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    customer: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  },
  
  // Active Status Colors
  active: {
    true: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    false: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  },
} as const;

/**
 * Get status color class for consistent styling
 */
export function getStatusColor(
  type: keyof typeof STATUS_COLORS,
  status: string
): string {
  const statusMap = STATUS_COLORS[type] as any;
  const normalizedStatus = status.toLowerCase();
  return statusMap[normalizedStatus] || statusMap.default || 'bg-gray-100 text-gray-800';
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: string | number, currency = 'NPR'): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `${currency} ${numAmount.toLocaleString('en-NP', { minimumFractionDigits: 2 })}`;
}

/**
 * Format date for admin tables
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format datetime for admin tables
 */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Capitalize first letter of each word
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Generate order number (utility for future use)
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  return `ORD-${year}-${timestamp}`;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Nepal format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+977-9[0-9]{9}$/;
  return phoneRegex.test(phone);
}

/**
 * Common API error handler
 */
export function handleApiError(error: any): string {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Common table pagination info
 */
export function getPaginationInfo(page: number, pageSize: number, total: number) {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const totalPages = Math.ceil(total / pageSize);
  
  return {
    start,
    end,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
