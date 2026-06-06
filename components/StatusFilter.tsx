'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { TicketStatus } from '@/types';

const STATUSES: Array<TicketStatus | 'All'> = ['All', 'Open', 'In Progress', 'Closed'];

/**
 * StatusFilter — Tab-style filter for ticket status.
 * Syncs with URL search params so filters are shareable.
 */
export default function StatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get('status') || 'All';

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === 'All') {
      params.delete('status');
    } else {
      params.set('status', status);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg" role="tablist">
      {STATUSES.map((status) => {
        const isActive = currentStatus === status || (status === 'All' && !searchParams.get('status'));
        return (
          <button
            key={status}
            role="tab"
            aria-selected={isActive}
            onClick={() => handleStatusChange(status)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              isActive
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {status}
          </button>
        );
      })}
    </div>
  );
}
