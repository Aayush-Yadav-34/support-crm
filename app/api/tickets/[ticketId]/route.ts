import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { UpdateTicketPayload, CreateNotePayload } from '@/types';

/**
 * GET /api/tickets/[ticketId]
 *
 * Get a single ticket by its human-readable ticket_id (e.g. TKT-001),
 * including all associated notes sorted chronologically.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;

    // Fetch the ticket
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('*')
      .eq('ticket_id', ticketId)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Fetch associated notes
    const { data: notes, error: notesError } = await supabase
      .from('notes')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (notesError) {
      console.error('Error fetching notes:', notesError);
    }

    return NextResponse.json({
      ...ticket,
      notes: notes || [],
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/tickets/[ticketId]
 *
 * Update a ticket's status/priority and optionally add a note.
 * Body: { status?, priority?, note_text? }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;
    const body: UpdateTicketPayload & { note_text?: string } = await request.json();

    // Build the update object — only include fields that were provided
    const updateData: Record<string, string> = {};
    if (body.status) {
      if (!['Open', 'In Progress', 'Closed'].includes(body.status)) {
        return NextResponse.json(
          { error: 'Status must be Open, In Progress, or Closed' },
          { status: 400 }
        );
      }
      updateData.status = body.status;
    }
    if (body.priority) {
      if (!['Low', 'Medium', 'High'].includes(body.priority)) {
        return NextResponse.json(
          { error: 'Priority must be Low, Medium, or High' },
          { status: 400 }
        );
      }
      updateData.priority = body.priority;
    }

    // Update the ticket if there are fields to update
    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabase
        .from('tickets')
        .update(updateData)
        .eq('ticket_id', ticketId);

      if (updateError) {
        console.error('Error updating ticket:', updateError);
        return NextResponse.json(
          { error: 'Failed to update ticket' },
          { status: 500 }
        );
      }
    }

    // Add a note if note_text was provided
    if (body.note_text && body.note_text.trim() !== '') {
      const notePayload: CreateNotePayload = {
        ticket_id: ticketId,
        note_text: body.note_text.trim(),
      };

      const { error: noteError } = await supabase
        .from('notes')
        .insert(notePayload);

      if (noteError) {
        console.error('Error adding note:', noteError);
        return NextResponse.json(
          { error: 'Ticket updated but failed to add note' },
          { status: 500 }
        );
      }
    }

    // Fetch and return the updated ticket with notes
    const { data: updatedTicket } = await supabase
      .from('tickets')
      .select('*')
      .eq('ticket_id', ticketId)
      .single();

    const { data: notes } = await supabase
      .from('notes')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    return NextResponse.json({
      ...updatedTicket,
      notes: notes || [],
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
