import type { Metadata } from 'next';
import Link from 'next/link';
import CreateTicketForm from '@/components/CreateTicketForm';

export const metadata: Metadata = {
  title: 'Create Ticket — Support CRM',
  description: 'Create a new customer support ticket.',
};

export default function NewTicketPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-600 transition-colors">
          Dashboard
        </Link>
        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-gray-900 font-medium">New Ticket</span>
      </div>

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Ticket</h1>
        <p className="text-sm text-gray-500 mt-1">
          Fill in the details below to create a new support ticket.
        </p>
      </div>

      {/* Form */}
      <CreateTicketForm />
    </div>
  );
}
