import { Suspense } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import StatusFilter from '@/components/StatusFilter';
import TicketList from '@/components/TicketList';
import DashboardStatsCards from '@/components/DashboardStats';

export default function HomePage() {
  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track all customer support tickets.
          </p>
        </div>
        <Link
          href="/tickets/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          id="create-ticket-btn"
        >
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          New Ticket
        </Link>
      </div>

      {/* Dashboard Stats */}
      <Suspense fallback={<div className="h-24 bg-gray-100 rounded-lg animate-pulse" />}>
        <DashboardStatsCards />
      </Suspense>

      {/* Search + Filter Bar */}
      <div className="mt-8 mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 w-full sm:max-w-md">
          <Suspense fallback={<div className="h-10 bg-gray-100 rounded-lg animate-pulse" />}>
            <SearchBar />
          </Suspense>
        </div>
        <Suspense fallback={<div className="h-10 w-64 bg-gray-100 rounded-lg animate-pulse" />}>
          <StatusFilter />
        </Suspense>
      </div>

      {/* Ticket List */}
      <Suspense
        fallback={
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-lg p-4 h-20 animate-pulse"
              />
            ))}
          </div>
        }
      >
        <TicketList />
      </Suspense>
    </div>
  );
}
