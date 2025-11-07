'use client'

import { useState } from 'react'

interface RatingProps {
  rating: number
  maxRating?: number
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  onRatingChange?: (rating: number) => void
}

export function Rating({
  rating,
  maxRating = 5,
  readonly = false,
  size = 'sm',
  onRatingChange,
}: RatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const handleStarClick = (starRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating)
    }
  }

  const handleMouseEnter = (starRating: number) => {
    if (!readonly) {
      setHoveredRating(starRating)
    }
  }

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoveredRating(0)
    }
  }

  const displayRating = hoveredRating || rating

  return (
    <div className="flex items-center space-x-1">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1
        const isFilled = starValue <= displayRating
        const isHalfFilled = starValue - 0.5 === displayRating

        return (
          <button
            key={index}
            type="button"
            className={`${sizeClasses[size]} ${readonly ? 'cursor-default' : 'cursor-pointer'} transition-colors`}
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
          >
            <svg
              className={`${sizeClasses[size]} ${
                isFilled
                  ? 'text-yellow-400'
                  : isHalfFilled
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isHalfFilled ? (
                <defs>
                  <linearGradient id={`half-gradient-${index}`}>
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="#d1d5db" />
                  </linearGradient>
                </defs>
              ) : null}
              <path
                fillRule="evenodd"
                d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                clipRule="evenodd"
                fill={isHalfFilled ? `url(#half-gradient-${index})` : 'currentColor'}
              />
            </svg>
          </button>
        )
      })}
    </div>
  )
}