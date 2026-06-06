import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { CreateTicketPayload } from '@/types';

/**
 * GET /api/tickets
 *
 * List tickets with optional search and status filter.
 * Query params:
 *   - search: free-text search across name, email, subject, description, ticket_id
 *   - status: 'Open' | 'In Progress' | 'Closed'
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status') || '';

    let query = supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply status filter
    if (status && status !== 'All') {
      query = query.eq('status', status);
    }

    // Apply search filter — use OR across multiple columns
    if (search) {
      query = query.or(
        `customer_name.ilike.%${search}%,` +
        `customer_email.ilike.%${search}%,` +
        `subject.ilike.%${search}%,` +
        `description.ilike.%${search}%,` +
        `ticket_id.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching tickets:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tickets' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tickets
 *
 * Create a new ticket. The ticket_id (TKT-XXX) is auto-generated
 * by the database trigger.
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateTicketPayload = await request.json();

    // Validate required fields
    const requiredFields: (keyof CreateTicketPayload)[] = [
      'customer_name',
      'customer_email',
      'subject',
      'description',
      'priority',
    ];

    for (const field of requiredFields) {
      if (!body[field] || String(body[field]).trim() === '') {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.customer_email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate priority
    if (!['Low', 'Medium', 'High'].includes(body.priority)) {
      return NextResponse.json(
        { error: 'Priority must be Low, Medium, or High' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('tickets')
      .insert({
        customer_name: body.customer_name.trim(),
        customer_email: body.customer_email.trim(),
        subject: body.subject.trim(),
        description: body.description.trim(),
        priority: body.priority,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating ticket:', error);
      return NextResponse.json(
        { error: 'Failed to create ticket' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
