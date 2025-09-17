"use client";

import { useRef, useEffect } from "react";
import GameLogo from "./GameLogo";
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

export default function Schedule({ 
  game, 
  year, 
  initialScrollPosition, 
  autoScrollToToday = true 
}: ScheduleProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const targetYear = year ?? new Date().getUTCFullYear();
  const totalDays = daysInYear(targetYear);
  const today = new Date();
  const showToday = today.getUTCFullYear() === targetYear;
  const todayPercent = showToday
    ? (getDayOfYearUtc(today) / totalDays) * 100
    : null;

  // Scroll to a specific position (0-100 percentage)
  const scrollToPosition = (percentage: number) => {
    if (scrollerRef.current) {
      const maxScroll = scrollerRef.current.scrollWidth - scrollerRef.current.clientWidth;
      scrollerRef.current.scrollLeft = maxScroll * (percentage / 100);
    }
  };

  // Scroll to today's position
  const scrollToToday = () => {
    if (todayPercent !== null) {
      scrollToPosition(todayPercent);
    }
  };

  // Handle automatic scrolling on mount
  useEffect(() => {
    if (scrollerRef.current) {
      if (autoScrollToToday && todayPercent !== null) {
        scrollToToday();
      } else if (initialScrollPosition !== undefined) {
        scrollToPosition(initialScrollPosition);
      }
    }
  }, [autoScrollToToday, initialScrollPosition, todayPercent]);

  return (
    <div className="schedule">
        <div className="schedule__title">
          {game ? <GameLogo game={game} /> : null}
        </div>
        <div className="schedule__scroller" ref={scrollerRef}>
          <div className="year-bar">
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


