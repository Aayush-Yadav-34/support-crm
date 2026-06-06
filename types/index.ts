/**
 * TypeScript interfaces for the Support CRM system.
 * These types mirror the Supabase database schema.
 */

// ─── Ticket ─────────────────────────────────────────────────────────────────

export type TicketStatus = 'Open' | 'In Progress' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'High';

export interface Ticket {
  id: string;            // UUID primary key
  ticket_id: string;     // Human-readable ID, e.g. TKT-001
  customer_name: string;
  customer_email: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;    // ISO 8601 timestamp
  updated_at: string;    // ISO 8601 timestamp
}

/** Payload for creating a new ticket (auto-generated fields excluded). */
export interface CreateTicketPayload {
  customer_name: string;
  customer_email: string;
  subject: string;
  description: string;
  priority: TicketPriority;
}

/** Payload for updating an existing ticket. */
export interface UpdateTicketPayload {
  status?: TicketStatus;
  priority?: TicketPriority;
  subject?: string;
  description?: string;
}

// ─── Note ───────────────────────────────────────────────────────────────────

export interface Note {
  id: string;            // UUID primary key
  ticket_id: string;     // Foreign key → tickets.ticket_id
  note_text: string;
  created_at: string;    // ISO 8601 timestamp
}

export interface CreateNotePayload {
  ticket_id: string;
  note_text: string;
}

// ─── API Response Wrappers ──────────────────────────────────────────────────

export interface TicketWithNotes extends Ticket {
  notes: Note[];
}

export interface DashboardStats {
  total: number;
  open: number;
  inProgress: number;
  closed: number;
}

// ─── Filter / Search ────────────────────────────────────────────────────────

export interface TicketFilters {
  search?: string;
  status?: TicketStatus | 'All';
}
