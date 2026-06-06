import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import TicketDetail from '@/components/TicketDetail';
import { supabase } from '@/lib/supabase';

interface TicketPageProps {
  params: Promise<{ ticketId: string }>;
}

/**
 * Fetch a single ticket with its notes from Supabase.
 * This runs server-side for SEO and performance.
 */
async function getTicket(ticketId: string) {
  const { data: ticket, error: ticketError } = await supabase
    .from('tickets')
    .select('*')
    .eq('ticket_id', ticketId)
    .single();

  if (ticketError || !ticket) return null;

  const { data: notes } = await supabase
    .from('notes')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });

  return {
    ...ticket,
    notes: notes || [],
  };
}

export async function generateMetadata({ params }: TicketPageProps): Promise<Metadata> {
  const { ticketId } = await params;
  const ticket = await getTicket(ticketId);

  if (!ticket) {
    return { title: 'Ticket Not Found — Support CRM' };
  }

  return {
    title: `${ticket.ticket_id}: ${ticket.subject} — Support CRM`,
    description: `Support ticket from ${ticket.customer_name}: ${ticket.subject}`,
  };
}

export default async function TicketPage({ params }: TicketPageProps) {
  const { ticketId } = await params;
  const ticket = await getTicket(ticketId);

  if (!ticket) {
    notFound();
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-600 transition-colors">
          Dashboard
        </Link>
        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-gray-900 font-medium font-mono">{ticket.ticket_id}</span>
      </div>

      <TicketDetail ticket={ticket} />
    </div>
  );
}
