import { useRef, useCallback, useEffect } from 'react';

export interface UseAccessibilityOptions {
  announceOnMount?: string;
  focusOnMount?: boolean;
}

export function useAccessibility(options: UseAccessibilityOptions = {}) {
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLElement>(null);

  // Announce message to screen readers
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (liveRegionRef.current) {
      liveRegionRef.current.setAttribute('aria-live', priority);
      liveRegionRef.current.textContent = message;
      
      // Clear the message after a brief delay to allow re-announcement
      setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  // Focus management
  const focusElement = useCallback(() => {
    if (elementRef.current) {
      elementRef.current.focus();
    }
  }, []);

  // Trap focus within an element (useful for modals)
  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
      
      if (e.key === 'Escape') {
        // Allow custom escape handling
        container.dispatchEvent(new CustomEvent('escape-pressed'));
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Auto-announce and focus on mount
  useEffect(() => {
    if (options.announceOnMount) {
      announce(options.announceOnMount);
    }
    
    if (options.focusOnMount && elementRef.current) {
      elementRef.current.focus();
    }
  }, [announce, options.announceOnMount, options.focusOnMount]);

  // Create live region element
  const LiveRegionElement = useCallback(() => (
    <div
      ref={liveRegionRef}
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  ), []);

  return {
    announce,
    focusElement,
    trapFocus,
    elementRef,
    liveRegionRef,
    LiveRegionElement,
  };
}

// Hook for managing keyboard navigation
export function useKeyboardNavigation() {
  const handleKeyNavigation = useCallback((
    event: React.KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    onIndexChange: (index: number) => void
  ) => {
    let newIndex = currentIndex;
    
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        newIndex = (currentIndex + 1) % items.length;
        event.preventDefault();
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
        event.preventDefault();
        break;
      case 'Home':
        newIndex = 0;
        event.preventDefault();
        break;
      case 'End':
        newIndex = items.length - 1;
        event.preventDefault();
        break;
    }
    
    if (newIndex !== currentIndex) {
      onIndexChange(newIndex);
      items[newIndex]?.focus();
    }
  }, []);

  return { handleKeyNavigation };
}

// Hook for reduced motion preference
export function useReducedMotion() {
  const prefersReducedMotion = 
    typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  return prefersReducedMotion;
} 