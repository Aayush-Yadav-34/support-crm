'use client';

import { useState } from 'react';
import type { Note } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { toast } from 'sonner';

interface NotesSectionProps {
  ticketId: string;
  initialNotes: Note[];
}

/**
 * NotesSection — Displays chronological notes for a ticket
 * and provides a form to add new notes.
 */
export default function NotesSection({ ticketId, initialNotes }: NotesSectionProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note_text: newNote }),
      });

      if (!response.ok) {
        throw new Error('Failed to add note');
      }

      const updatedTicket = await response.json();
      setNotes(updatedTicket.notes);
      setNewNote('');
      toast.success('Note added successfully');
    } catch (error) {
      toast.error('Failed to add note', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
          </svg>
          Notes ({notes.length})
        </h2>
      </div>

      {/* Notes list */}
      <div className="divide-y divide-gray-100">
        {notes.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-gray-400">No notes yet. Add the first note below.</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="p-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.note_text}</p>
              <p className="text-xs text-gray-400 mt-2">{formatDateTime(note.created_at)}</p>
            </div>
          ))
        )}
      </div>

      {/* Add note form */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <form onSubmit={handleAddNote} className="space-y-3">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write a note..."
            rows={3}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            id="add-note-textarea"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !newNote.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Adding...
                </>
              ) : (
                'Add Note'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
