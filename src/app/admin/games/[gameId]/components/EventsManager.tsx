'use client';

import { Game, Event } from '@/lib/db/schema';
import { createEvent } from '@/lib/actions/events';
import { useState } from 'react';
import styles from './EventsManager.module.css';

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
    <div className={styles.container}>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Add New Event</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Event Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter event name"
              required
              className={styles.input}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="startDate" className={styles.label}>
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                required
                className={styles.input}
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="endDate" className={styles.label}>
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                required
                className={styles.input}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button type="submit" className={styles.button} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Events ({events.length})
        </h2>
        {events.length === 0 ? (
          <p className={styles.emptyText}>
            No events yet. Create one using the form above.
          </p>
        ) : (
          <div className={styles.eventsList}>
            {sortedEvents.map((event) => (
              <div key={event.id} className={styles.eventCard}>
                <div className={styles.eventHeader}>
                  <h3 className={styles.eventName}>{event.name}</h3>
                  <span className={styles.eventSlug}>{event.slug}</span>
                </div>
                <div className={styles.eventDates}>
                  <div className={styles.dateGroup}>
                    <span className={styles.dateLabel}>Start:</span>
                    <span className={styles.dateValue}>
                      {formatDate(event.startDate)}
                    </span>
                  </div>
                  <div className={styles.dateGroup}>
                    <span className={styles.dateLabel}>End:</span>
                    <span className={styles.dateValue}>
                      {formatDate(event.endDate)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

