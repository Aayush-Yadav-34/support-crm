'use client';

import Link from 'next/link';
import type { Ticket } from '@/types';
import { cn, formatDate, getStatusColor, getPriorityColor, copyToClipboard } from '@/lib/utils';
import { useState } from 'react';

interface TicketCardProps {
  ticket: Ticket;
}

/**
 * TicketCard — Displays a single ticket as a card/row in the list.
 * Clicking navigates to the ticket detail page.
 */
export default function TicketCard({ ticket }: TicketCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyId = async (e: React.MouseEvent) => {
    e.preventDefault(); // Don't navigate to ticket detail
    e.stopPropagation();
    const success = await copyToClipboard(ticket.ticket_id);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Link
      href={`/tickets/${ticket.ticket_id}`}
      className="block group"
      id={`ticket-${ticket.ticket_id}`}
    >
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Ticket info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {/* Ticket ID with copy button */}
              <button
                onClick={handleCopyId}
                className="inline-flex items-center gap-1 font-mono text-xs text-gray-500 hover:text-gray-700 transition-colors"
                title="Copy ticket ID"
              >
                {ticket.ticket_id}
                {copied ? (
                  <svg className="h-3 w-3 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                ) : (
                  <svg className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                  </svg>
                )}
              </button>

              {/* Priority badge */}
              <span className={cn('inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border', getPriorityColor(ticket.priority))}>
                {ticket.priority}
              </span>
            </div>

            {/* Subject */}
            <h3 className="text-sm font-semibold text-gray-900 truncate mb-1 group-hover:text-blue-600 transition-colors">
              {ticket.subject}
            </h3>

            {/* Customer info */}
            <p className="text-xs text-gray-500 truncate">
              {ticket.customer_name} · {ticket.customer_email}
            </p>
          </div>

          {/* Right: Status + date */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className={cn('inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border', getStatusColor(ticket.status))}>
              {ticket.status}
            </span>
            <span className="text-xs text-gray-400">
              {formatDate(ticket.created_at)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
