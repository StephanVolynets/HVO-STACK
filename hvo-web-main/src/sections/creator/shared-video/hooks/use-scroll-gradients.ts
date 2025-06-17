import { useEffect, useState, RefObject } from 'react';

interface ScrollGradientOptions {
  scrollBuffer?: number;
  leftThreshold?: number;
}

/**
 * Hook that handles show/hide logic for scroll gradients on both sides of a scrollable container
 */
export const useScrollGradients = (
  scrollRef: RefObject<HTMLElement>,
  options: ScrollGradientOptions = {}
) => {
  const { scrollBuffer = 1, leftThreshold = 2 } = options;
  const [showRightGradient, setShowRightGradient] = useState(true);
  const [showLeftGradient, setShowLeftGradient] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      
      // Hide right gradient when scrolled to the end (with a small buffer)
      const isAtEnd = Math.ceil(scrollLeft + clientWidth) >= scrollWidth - scrollBuffer;
      setShowRightGradient(!isAtEnd);

      // Show left gradient when scrolled to the right
      setShowLeftGradient(scrollLeft > leftThreshold);
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      // Check initial state
      handleScroll();
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [scrollRef, scrollBuffer, leftThreshold]);

  return {
    showLeftGradient,
    showRightGradient
  };
}; 