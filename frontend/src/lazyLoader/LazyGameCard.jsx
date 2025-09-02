import React, { useState, useEffect, useRef } from 'react';
import GameCardSkeleton from './GameCardSkeleton';

const LazyGameCard = ({ children, threshold = 0.1, delay = 300, suppressSkeleton = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Add a small delay to show the skeleton briefly
          setTimeout(() => {
            setIsLoaded(true);
          }, delay);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin: '50px',
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [threshold, delay]);

  return (
    <div ref={cardRef}>
      {suppressSkeleton || (isVisible && isLoaded) ? (
        <div className="animate-fadeIn">
          {children}
        </div>
      ) : (
        <GameCardSkeleton />
      )}
    </div>
  );
};

export default LazyGameCard;
