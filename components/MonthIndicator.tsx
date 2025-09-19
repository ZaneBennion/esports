"use client";

import { useRef, useEffect } from "react";
import { useScrollContext } from "@/contexts/ScrollContext";
import "./MonthIndicator.css";

type MonthIndicatorProps = {
  year?: number;
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function daysInYear(year: number): number {
  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year + 1, 0, 1);
  return (end - start) / (1000 * 60 * 60 * 24);
}

export default function MonthIndicator({ year }: MonthIndicatorProps) {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const targetYear = year ?? new Date().getUTCFullYear();
  
  // Get scroll context for synchronized scrolling
  const { registerScroller, unregisterScroller, scrollToPosition } = useScrollContext();

  // Register this scroller with the context
  useEffect(() => {
    if (indicatorRef.current) {
      registerScroller("month-indicator", indicatorRef.current);
      return () => unregisterScroller("month-indicator");
    }
  }, [registerScroller, unregisterScroller]);

  // Handle scroll synchronization
  useEffect(() => {
    const indicator = indicatorRef.current;
    if (!indicator) return;

    const handleScroll = () => {
      // Calculate current scroll percentage
      const maxScroll = indicator.scrollWidth - indicator.clientWidth;
      if (maxScroll > 0) {
        const scrollPercentage = (indicator.scrollLeft / maxScroll) * 100;
        
        // Sync all other scrollers to this position
        scrollToPosition(scrollPercentage);
      }
    };

    indicator.addEventListener('scroll', handleScroll);
    return () => indicator.removeEventListener('scroll', handleScroll);
  }, [scrollToPosition]);

  return (
    <div className="month-indicator">
      <div className="month-indicator-scroller" ref={indicatorRef}>
        <div className="month-indicator-bar">
          {MONTHS.map((month, index) => {
            // Calculate the position for each month
            const monthStart = (index / 12) * 100;
            const monthWidth = (1 / 12) * 100;
            
            return (
              <div
                key={month}
                className="month-indicator-month"
                style={{
                  left: `${monthStart}%`,
                  width: `${monthWidth}%`,
                }}
              >
                {month}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
