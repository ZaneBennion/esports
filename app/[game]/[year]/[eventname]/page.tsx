"use client";

import { useParams } from "next/navigation";
import { useEvents } from "@/hooks/useEvents";
import { EventRow } from "@/hooks/useEvents";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createEventSlug, getGameName } from "@/lib/eventUtils";
import "./EventDetail.css";

// Utility function to find event by slug
function findEventBySlug(events: EventRow[], eventSlug: string): EventRow | null {
  return events.find(event => createEventSlug(event.name) === eventSlug) || null;
}

export default function EventDetailPage() {
  const params = useParams();
  const gameSlug = params.game as string;
  const year = parseInt(params.year as string);
  const eventSlug = params.eventname as string;
  
  // Convert game slug to actual game name for database queries
  const game = getGameName(gameSlug);
  
  const { events, loading, error } = useEvents(game, year);
  const [event, setEvent] = useState<EventRow | null>(null);

  useEffect(() => {
    if (events.length > 0) {
      const foundEvent = findEventBySlug(events, eventSlug);
      setEvent(foundEvent);
    }
  }, [events, eventSlug]);

  if (loading) {
    return (
      <div className="event-detail-loading">
        <h1>Loading event details...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-detail-error">
        <h1>Error loading event</h1>
        <p>{error}</p>
        <Link href="/" className="event-detail-back-link">
          ← Back to schedule
        </Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-detail-not-found">
        <h1>Event not found</h1>
        <p>The event you're looking for doesn't exist.</p>
        <Link href="/" className="event-detail-back-link">
          ← Back to schedule
        </Link>
      </div>
    );
  }

  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  const isMultiDay = startDate.getTime() !== endDate.getTime();

  return (
    <div className="event-detail-container">
      <Link href="/" className="event-detail-back-link">
        ← Back to schedule
      </Link>
      
      <div className="event-detail-header">
        <h1 
          className="event-detail-title"
          style={{ color: event.color || '#000' }}
        >
          {event.name}
        </h1>
        <div className="event-detail-subtitle">
          {game} • {year}
        </div>
        <div className="event-detail-location">
          📍 {event.location}
        </div>
      </div>

      <div 
        className="event-detail-card"
        style={{ borderColor: event.color || '#e0e0e0' }}
      >
        <h2 className="event-detail-card-title">
          Event Details
        </h2>
        
        <div className="event-detail-info-item">
          <span className="event-detail-info-label">Date:</span> {isMultiDay 
            ? `${startDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} - ${endDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}`
            : startDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })
          }
        </div>
        
        <div className="event-detail-info-item">
          <span className="event-detail-info-label">Location:</span> {event.location}
        </div>
        
        <div className="event-detail-info-item">
          <span className="event-detail-info-label">Game:</span> {event.game}
        </div>
        
        <div className="event-detail-info-item">
          <span className="event-detail-info-label">Year:</span> {event.year}
        </div>
        
        <div className="event-detail-info-item">
          <span className="event-detail-info-label">Duration:</span> {isMultiDay 
            ? `${Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1} days`
            : '1 day'
          }
        </div>
      </div>
    </div>
  );
}
