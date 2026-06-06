import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind CSS classes with clsx for conditional class names.
 * This is the standard pattern used by shadcn/ui components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string into a human-readable format.
 * @example formatDate('2024-01-15T10:30:00Z') → 'Jan 15, 2024'
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date string into a human-readable format with time.
 * @example formatDateTime('2024-01-15T10:30:00Z') → 'Jan 15, 2024 at 10:30 AM'
 */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Returns Tailwind classes for a status badge.
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'Open':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'In Progress':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Closed':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

/**
 * Returns Tailwind classes for a priority badge.
 */
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'Low':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Medium':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'High':
      return 'bg-red-50 text-red-700 border-red-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

/**
 * Returns the priority dot color for inline indicators.
 */
export function getPriorityDot(priority: string): string {
  switch (priority) {
    case 'Low':
      return 'bg-blue-500';
    case 'Medium':
      return 'bg-yellow-500';
    case 'High':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}

/**
 * Copy text to clipboard with a fallback for older browsers.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
}
