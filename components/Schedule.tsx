"use client";

import { useRef, useEffect, useId } from "react";
import GameLogo from "./GameLogo";
import { useEvents } from "@/hooks/useEvents";
import { useScrollContext } from "@/contexts/ScrollContext";
import "./Schedule.css";

type ScheduleProps = {
  game?: string;
  year?: number;
  initialScrollPosition?: number; // 0-100 percentage
  autoScrollToToday?: boolean;
};

function daysInYear(year: number): number {
  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year + 1, 0, 1);
  return (end - start) / (1000 * 60 * 60 * 24);
}

function getDayOfYearUtc(date: Date): number {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const start = Date.UTC(d.getUTCFullYear(), 0, 1);
  const diff = (d.getTime() - start) / (1000 * 60 * 60 * 24);
  return Math.floor(diff) + 1; // 1..366
}

function getDayOfYear(dateIso: string): number {
  const d = new Date(dateIso + "T00:00:00Z");
  const start = Date.UTC(d.getUTCFullYear(), 0, 1);
  const diff = (d.getTime() - start) / (1000 * 60 * 60 * 24);
  return Math.floor(diff) + 1; // 1..366
}

function clamp(min: number, v: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export default function Schedule({ 
  game, 
  year, 
  initialScrollPosition, 
  autoScrollToToday = true 
}: ScheduleProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const componentId = useId();
  const targetYear = year ?? new Date().getUTCFullYear();
  const totalDays = daysInYear(targetYear);
  const today = new Date();
  const showToday = today.getUTCFullYear() === targetYear;
  const todayPercent = showToday
    ? (getDayOfYearUtc(today) / totalDays) * 100
    : null;

  // Fetch events for the specified game and year
  const { events, loading, error } = useEvents(game || "", targetYear);
  
  // Get scroll context for synchronized scrolling
  const { registerScroller, unregisterScroller, scrollToPosition, scrollToToday } = useScrollContext();

  // Register this scroller with the context
  useEffect(() => {
    if (scrollerRef.current) {
      registerScroller(componentId, scrollerRef.current);
      return () => unregisterScroller(componentId);
    }
  }, [componentId, registerScroller, unregisterScroller]);

  // Handle scroll synchronization
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const handleScroll = () => {
      // Calculate current scroll percentage
      const maxScroll = scroller.scrollWidth - scroller.clientWidth;
      if (maxScroll > 0) {
        const scrollPercentage = (scroller.scrollLeft / maxScroll) * 100;
        
        // Sync all other scrollers to this position
        scrollToPosition(scrollPercentage);
      }
    };

    scroller.addEventListener('scroll', handleScroll);
    return () => scroller.removeEventListener('scroll', handleScroll);
  }, [scrollToPosition]);

  // Handle automatic scrolling on mount
  useEffect(() => {
    if (scrollerRef.current) {
      if (autoScrollToToday && todayPercent !== null) {
        scrollToToday();
      } else if (initialScrollPosition !== undefined) {
        scrollToPosition(initialScrollPosition);
      }
    }
  }, [autoScrollToToday, initialScrollPosition, todayPercent, scrollToToday, scrollToPosition]);

  return (
    <div className="schedule">
        <div className="schedule__title">
          {game ? <GameLogo game={game} /> : null}
        </div>
        <div className="schedule__scroller" ref={scrollerRef}>
          <div className="year-bar">
            {/* Event blocks */}
            {events.map((event) => {
              const start = clamp(1, getDayOfYear(event.start_date), totalDays);
              const end = clamp(start, getDayOfYear(event.end_date), totalDays);
              const left = (start / totalDays) * 100;
              const width = ((end - start + 1) / totalDays) * 100;
              const title = `${event.name} — ${event.location}`;
              const startDate = new Date(event.start_date).toLocaleDateString();
              const endDate = new Date(event.end_date).toLocaleDateString();
              
              return (
                <div
                  key={event.id}
                  className="event-block"
                  style={{ 
                    left: `${left}%`, 
                    width: `${width}%`,
                    backgroundColor: event.color || 'rgba(255, 255, 255, 0.9)'
                  }}
                  title={title}
                >
                  <div className="event-block__content">
                    <div className="event-block__name">{event.name}</div>
                    <div className="event-block__location">{event.location}</div>
                    <div className="event-block__dates">
                      {startDate === endDate ? startDate : `${startDate} - ${endDate}`}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Today marker */}
            {showToday && todayPercent !== null && (
              <div
                className="today-marker"
                style={{
                  left: `${todayPercent}%`,
                }}
              />
            )}
          </div>
        </div>
      </div>
  );
}


