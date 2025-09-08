import { useEffect, useRef } from 'react';

interface TouchNavigationProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export function TouchNavigation({ onSwipeLeft, onSwipeRight, children, disabled = false }: TouchNavigationProps) {
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const touchEndY = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;
  const maxVerticalDistance = 100;

  const handleTouchStart = (e: TouchEvent) => {
    if (disabled) return;
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (disabled) return;
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (disabled) return;
    
    const horizontalDistance = touchStartX.current - touchEndX.current;
    const verticalDistance = Math.abs(touchStartY.current - touchEndY.current);
    
    // Only trigger swipe if horizontal distance is significant and vertical distance is small
    if (Math.abs(horizontalDistance) > minSwipeDistance && verticalDistance < maxVerticalDistance) {
      if (horizontalDistance > 0) {
        // Swiped left - go to next chapter
        onSwipeLeft();
      } else {
        // Swiped right - go to previous chapter
        onSwipeRight();
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [disabled]);

  return (
    <div ref={containerRef} className="w-full h-full">
      {children}
    </div>
  );
}