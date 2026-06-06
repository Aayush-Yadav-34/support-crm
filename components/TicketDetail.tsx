'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { TicketWithNotes, TicketStatus } from '@/types';
import { cn, formatDateTime, getStatusColor, getPriorityColor, copyToClipboard } from '@/lib/utils';
import NotesSection from './NotesSection';
import { toast } from 'sonner';

interface TicketDetailProps {
  ticket: TicketWithNotes;
}

const STATUSES: TicketStatus[] = ['Open', 'In Progress', 'Closed'];

/**
 * TicketDetail — Full ticket detail view with status update and notes.
 */
export default function TicketDetail({ ticket: initialTicket }: TicketDetailProps) {
  const router = useRouter();
  const [ticket, setTicket] = useState(initialTicket);
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>(initialTicket.status);
  const [updating, setUpdating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleStatusUpdate = async () => {
    if (selectedStatus === ticket.status) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/tickets/${ticket.ticket_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      const updated = await response.json();
      setTicket(updated);
      toast.success('Status updated', {
        description: `Ticket ${ticket.ticket_id} is now "${selectedStatus}".`,
      });
      router.refresh();
    } catch (error) {
      toast.error('Failed to update status', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
      setSelectedStatus(ticket.status); // Revert
    } finally {
      setUpdating(false);
    }
  };

  const handleCopyId = async () => {
    const success = await copyToClipboard(ticket.ticket_id);
    if (success) {
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link
              href="/"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Back to tickets"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <button
              onClick={handleCopyId}
              className="inline-flex items-center gap-1.5 font-mono text-sm text-gray-500 hover:text-gray-700 transition-colors"
              title="Copy ticket ID"
            >
              {ticket.ticket_id}
              {copied ? (
                <svg className="h-3.5 w-3.5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              ) : (
                <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                </svg>
              )}
            </button>
          </div>
          <h1 className="text-xl font-bold text-gray-900">{ticket.subject}</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border', getPriorityColor(ticket.priority))}>
            {ticket.priority} Priority
          </span>
          <span className={cn('inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border', getStatusColor(ticket.status))}>
            {ticket.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - left 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              Description
            </h2>
            <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
          </div>

          {/* Notes */}
          <NotesSection ticketId={ticket.ticket_id} initialNotes={ticket.notes} />
        </div>

        {/* Sidebar - right 1/3 */}
        <div className="space-y-6">
          {/* Status Update */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Update Status</h2>
            <div className="space-y-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as TicketStatus)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                id="status-select"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button
                onClick={handleStatusUpdate}
                disabled={updating || selectedStatus === ticket.status}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                id="update-status-btn"
              >
                {updating ? 'Updating...' : 'Save Status'}
              </button>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              Customer
            </h2>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Name</p>
                <p className="text-sm text-gray-900 font-medium">{ticket.customer_name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Email</p>
                <a href={`mailto:${ticket.customer_email}`} className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                  {ticket.customer_email}
                </a>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Created</span>
                <span className="text-xs text-gray-600">{formatDateTime(ticket.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Updated</span>
                <span className="text-xs text-gray-600">{formatDateTime(ticket.updated_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Priority</span>
                <span className={cn('inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border', getPriorityColor(ticket.priority))}>
                  {ticket.priority}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
