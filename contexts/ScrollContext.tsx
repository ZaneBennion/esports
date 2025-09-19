"use client";

import { createContext, useContext, useRef, useCallback } from "react";

/**
 * ScrollContext provides a centralized way to manage horizontal scrolling across multiple components.
 * This is particularly useful for timeline or calendar views where you want to synchronize
 * the scroll position of multiple scrollable elements.
 */

interface ScrollContextType {
  /** Register a scrollable element with a unique ID for coordinated scrolling */
  registerScroller: (id: string, element: HTMLDivElement) => void;
  /** Remove a scrollable element from the coordinated scrolling system */
  unregisterScroller: (id: string) => void;
  /** Scroll all registered elements to a specific percentage position (0-100) */
  scrollToPosition: (percentage: number) => void;
  /** Scroll all registered elements to today's position based on the current date */
  scrollToToday: () => void;
}

const ScrollContext = createContext<ScrollContextType | null>(null);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  // Store references to all registered scrollable elements
  // Using a Map allows us to associate each element with a unique ID
  const scrollersRef = useRef<Map<string, HTMLDivElement>>(new Map());

  /**
   * Register a scrollable element so it can be controlled by the context
   * @param id - Unique identifier for the scrollable element
   * @param element - The HTMLDivElement that can be scrolled horizontally
   */
  const registerScroller = useCallback((id: string, element: HTMLDivElement) => {
    scrollersRef.current.set(id, element);
  }, []);

  /**
   * Remove a scrollable element from the context's control
   * @param id - The unique identifier of the element to remove
   */
  const unregisterScroller = useCallback((id: string) => {
    scrollersRef.current.delete(id);
  }, []);

  /**
   * Scroll all registered elements to a specific percentage position
   * @param percentage - Position as percentage (0-100) of the total scrollable width
   */
  const scrollToPosition = useCallback((percentage: number) => {
    scrollersRef.current.forEach((element) => {
      // Calculate the maximum scroll position for this element
      const maxScroll = element.scrollWidth - element.clientWidth;
      // Set the scroll position based on the percentage
      element.scrollLeft = maxScroll * (percentage / 100);
    });
  }, []);
  
  /**
   * Scroll all registered elements to today's position based on the current date
   * This is useful for timeline views where you want to show the current date
   */
  const scrollToToday = useCallback(() => {
    const today = new Date();
    const currentYear = today.getUTCFullYear();
    
    // Calculate today's position as percentage of the year
    const startOfYear = new Date(currentYear, 0, 1); // January 1st
    const endOfYear = new Date(currentYear, 11, 31); // December 31st
    const totalDays = Math.ceil((endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const dayOfYear = Math.ceil((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const todayPercent = (dayOfYear / totalDays) * 100;
    
    // Use the calculated percentage to scroll to today's position
    scrollToPosition(todayPercent);
  }, []);

  return (
    <ScrollContext.Provider
      value={{
        registerScroller,
        unregisterScroller,
        scrollToPosition,
        scrollToToday,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
}

/**
 * Custom hook to access the ScrollContext
 * @returns The scroll context with all available methods
 * @throws Error if used outside of a ScrollProvider
 */
export function useScrollContext() {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScrollContext must be used within a ScrollProvider");
  }
  return context;
}