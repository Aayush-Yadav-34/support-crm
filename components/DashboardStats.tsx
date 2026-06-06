'use client';

import { useEffect, useState } from 'react';
import type { DashboardStats } from '@/types';

/**
 * DashboardStats — Shows ticket count stats: Total, Open, In Progress, Closed.
 */
export default function DashboardStatsCards() {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    open: 0,
    inProgress: 0,
    closed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/tickets');
        if (!response.ok) throw new Error('Failed to fetch');
        const tickets = await response.json();

        setStats({
          total: tickets.length,
          open: tickets.filter((t: { status: string }) => t.status === 'Open').length,
          inProgress: tickets.filter((t: { status: string }) => t.status === 'In Progress').length,
          closed: tickets.filter((t: { status: string }) => t.status === 'Closed').length,
        });
      } catch {
        // Silently fail — stats are non-critical
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const cards = [
    {
      label: 'Total Tickets',
      value: stats.total,
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
        </svg>
      ),
      color: 'bg-gray-50 text-gray-600 border-gray-200',
      iconBg: 'bg-gray-100',
    },
    {
      label: 'Open',
      value: stats.open,
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      iconBg: 'bg-blue-100',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      iconBg: 'bg-amber-100',
    },
    {
      label: 'Closed',
      value: stats.closed,
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      color: 'bg-green-50 text-green-700 border-green-200',
      iconBg: 'bg-green-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`${card.color} border rounded-lg p-3 sm:p-4 transition-all`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider opacity-80 truncate">
              {card.label}
            </span>
            <div className={`${card.iconBg} p-1.5 rounded-md shrink-0`}>
              {card.icon}
            </div>
          </div>
          {loading ? (
            <div className="h-8 w-12 bg-current/10 rounded animate-pulse" />
          ) : (
            <p className="text-xl sm:text-2xl font-bold">{card.value}</p>
          )}
        </div>
      ))}
    </div>
  );
}
