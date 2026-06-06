'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

/**
 * SearchBar — Debounced search input that syncs with URL search params.
 * Searches across customer_name, email, subject, description, and ticket_id.
 */
export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');

  // Keep input in sync with URL search params (e.g., if cleared externally)
  const urlSearch = searchParams.get('search') || '';
  useEffect(() => {
    setQuery(urlSearch);
  }, [urlSearch]);

  // Debounced URL update
  useEffect(() => {
    const currentSearch = searchParams.get('search') || '';
    const targetValue = query.trim();

    // If query matches URL, skip scheduling a timeout
    if (targetValue === currentSearch) {
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (targetValue) {
        params.set('search', targetValue);
      } else {
        params.delete('search');
      }
      router.push(`/?${params.toString()}`);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query, router, searchParams]);

  const handleClear = () => {
    setQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="relative">
      {/* Search icon */}
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      <input
        id="ticket-search"
        type="text"
        placeholder="Search tickets by name, email, subject, or ID..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Clear search"
        >
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
