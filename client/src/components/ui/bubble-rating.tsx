import React from 'react';
import { cn } from '@/lib/utils';

type BubbleRatingProps = {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showScore?: boolean;
};

/**
 * BubbleRating component displays a rating as circular bubbles (similar to TripAdvisor)
 */
export function BubbleRating({ 
  rating, 
  reviewCount, 
  size = 'md', 
  className,
  showScore = true
}: BubbleRatingProps) {
  const fullCircles = Math.floor(rating);
  const hasHalfCircle = rating % 1 >= 0.5;
  const maxRating = 5;
  
  // Determine the size class for the bubbles
  const sizeClass = {
    sm: 'h-2.5 w-2.5',
    md: 'h-3.5 w-3.5',
    lg: 'h-4.5 w-4.5',
  }[size];
  
  // Determine the margin between bubbles
  const marginClass = {
    sm: 'mr-0.5',
    md: 'mr-1',
    lg: 'mr-1.5',
  }[size];
  
  // Determine text size for rating number and review count
  const textSizeClass = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }[size];
  
  return (
    <div className={cn('flex items-center', className)}>
      {showScore && (
        <span className={cn('font-bold text-green-700 mr-1', textSizeClass)}>
          {rating.toFixed(1)}
        </span>
      )}
      <div className="flex items-center">
        {[...Array(maxRating)].map((_, i) => (
          <div
            key={i}
            className={cn(
              sizeClass,
              marginClass,
              'rounded-full',
              i < fullCircles
                ? 'bg-green-700' // Full circle
                : i === fullCircles && hasHalfCircle
                ? 'bg-gradient-to-r from-green-700 from-50% to-gray-300 to-50%' // Half circle
                : 'bg-gray-300' // Empty circle
            )}
          />
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className={cn('text-gray-500 ml-1', textSizeClass)}>
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}