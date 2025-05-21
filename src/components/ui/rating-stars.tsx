import * as React from "react"
import { cn } from "@/lib/utils"

interface RatingStarsProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number
}

const RatingStars = React.forwardRef<HTMLDivElement, RatingStarsProps>(
  ({ className, rating, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex text-yellow-400 mr-1", className)}
        {...props}
      >
        {Array(5).fill(0).map((_, i) => {
          const fullStars = Math.floor(rating)
          const decimal = rating % 1
          const isActiveStar = i === fullStars
          const fillPercent = isActiveStar ? Math.round(decimal * 10) * 10 : 0

          return (
            <div key={i} className="relative w-3 h-3">
              {/* Estrela vazia (fundo) */}
              <svg viewBox="0 0 24 24" className="absolute w-3 h-3 stroke-current fill-none">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>

              {/* Estrela cheia */}
              {i < fullStars && (
                <svg viewBox="0 0 24 24" className="absolute w-3 h-3 fill-current">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              )}

              {/* Estrela parcial */}
              {isActiveStar && fillPercent > 0 && (
                <svg viewBox="0 0 24 24" className="absolute w-3 h-3">
                  <defs>
                    <linearGradient id={`star-gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset={`${fillPercent}%`} stopColor="currentColor" />
                      <stop offset={`${fillPercent}%`} stopColor="transparent" />
                    </linearGradient>
                  </defs>
                  <path 
                    fill={`url(#star-gradient-${i})`} 
                    stroke="currentColor"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
                  />
                </svg>
              )}
            </div>
          )
        })}
      </div>
    )
  }
)
RatingStars.displayName = "RatingStars"

export { RatingStars }