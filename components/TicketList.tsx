'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Ticket } from '@/types';
import TicketCard from './TicketCard';

/**
 * TicketList — Fetches and renders the list of tickets.
 * Reacts to URL search params for search and status filter.
 */
export default function TicketList() {
  const searchParams = useSearchParams();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      const search = searchParams.get('search');
      const status = searchParams.get('status');

      if (search) params.set('search', search);
      if (status) params.set('status', status);

      const response = await fetch(`/api/tickets?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }

      const data = await response.json();
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Prevent loading skeleton from flashing on fast requests
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setTimeout(() => {
        setShowSkeleton(true);
      }, 150); // Show skeleton only if loading takes > 150ms
    } else {
      setShowSkeleton(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  // Loading state
  if (loading) {
    if (!showSkeleton) {
      return null;
    }
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                  <div className="h-4 w-12 bg-gray-200 rounded-full" />
                </div>
                <div className="h-4 w-48 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-36 bg-gray-200 rounded" />
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="h-5 w-20 bg-gray-200 rounded-full" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg className="mx-auto h-8 w-8 text-red-400 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
        <p className="text-sm text-red-600 font-medium">{error}</p>
        <button
          onClick={fetchTickets}
          className="mt-3 text-sm text-red-600 hover:text-red-700 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  // Empty state
  if (tickets.length === 0) {
    const hasFilters = searchParams.get('search') || searchParams.get('status');
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">
          {hasFilters ? 'No tickets found' : 'No tickets yet'}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {hasFilters
            ? 'Try adjusting your search or filter criteria.'
            : 'Create your first support ticket to get started.'}
        </p>
        {!hasFilters && (
          <a
            href="/tickets/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Ticket
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
