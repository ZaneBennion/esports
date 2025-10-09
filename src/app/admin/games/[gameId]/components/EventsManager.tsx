'use client';

import { Game, Event } from '@/lib/db/schema';
import { createEvent } from '@/lib/actions/events';
import { useState } from 'react';

// Sub-component: Form Section
function FormSection({ onSubmit, isSubmitting }: { onSubmit: (e: React.FormEvent<HTMLFormElement>) => void, isSubmitting: boolean }) {
  return (
    <div className="bg-background rounded-xl p-6 border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4">Add New Event</h2>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground/70">Event Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter event name"
            required
            className="p-2.5 border border-foreground/20 rounded-md bg-background text-foreground text-sm"
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground/70">Start Date</label>
            <input
              type="date"
              name="startDate"
              required
              className="p-2.5 border border-foreground/20 rounded-md bg-background text-foreground text-sm"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground/70">End Date</label>
            <input
              type="date"
              name="endDate"
              required
              className="p-2.5 border border-foreground/20 rounded-md bg-background text-foreground text-sm"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="p-2.5 px-4 border-0 rounded-md bg-foreground text-background font-semibold text-sm cursor-pointer transition-all hover:opacity-90"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </div>
  )
}

// Sub-component: Event Card
function EventCard({ event, formatDate }: { event: Event, formatDate: (date: string) => string }) {
  return (
    <div className="p-4 rounded-lg bg-[var(--foreground)]/[0.03] border border-foreground/10">
      <div className="mb-3">
        <h3 className="text-lg font-semibold mb-1">{event.name}</h3>
        <span className="text-xs text-foreground/50">{event.slug}</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground/70 font-medium">Start:</span>
          <span className="text-sm">{formatDate(event.startDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground/70 font-medium">End:</span>
          <span className="text-sm">{formatDate(event.endDate)}</span>
        </div>
      </div>
    </div>
  )
}

export default function EventsManager({
  game,
  events,
}: {
  game: Game;
  events: Event[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.append('gameId', game.id.toString());
      await createEvent(formData);
      e.currentTarget.reset();
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Sort events by start date (newest first)
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <FormSection onSubmit={handleSubmit} isSubmitting={isSubmitting} />

      <div className="bg-background rounded-xl p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4">Events ({events.length})</h2>
        {events.length === 0 ? (
          <p className="text-center text-foreground/50 py-8">No events yet. Create one using the form above.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {sortedEvents.map((event) => (
              <EventCard key={event.id} event={event} formatDate={formatDate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

