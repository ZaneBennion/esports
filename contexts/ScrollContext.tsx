"use client";

import { createContext, useContext, useRef, useCallback } from "react";

interface ScrollContextType {
  registerScroller: (id: string, element: HTMLDivElement) => void;
  unregisterScroller: (id: string) => void;
  scrollToPosition: (percentage: number) => void;
  scrollToToday: () => void;
}

const ScrollContext = createContext<ScrollContextType | null>(null);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const scrollersRef = useRef<Map<string, HTMLDivElement>>(new Map());

  const registerScroller = useCallback((id: string, element: HTMLDivElement) => {
    scrollersRef.current.set(id, element);
  }, []);

  const unregisterScroller = useCallback((id: string) => {
    scrollersRef.current.delete(id);
  }, []);

  const scrollToPosition = useCallback((percentage: number) => {
    scrollersRef.current.forEach((element) => {
      const maxScroll = element.scrollWidth - element.clientWidth;
      element.scrollLeft = maxScroll * (percentage / 100);
    });
  }, []);

  const scrollToToday = useCallback(() => {
    const today = new Date();
    const currentYear = today.getUTCFullYear();
    
    // Calculate today's position as percentage of the year
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31);
    const totalDays = Math.ceil((endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const dayOfYear = Math.ceil((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const todayPercent = (dayOfYear / totalDays) * 100;
    
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

export function useScrollContext() {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScrollContext must be used within a ScrollProvider");
  }
  return context;
}
