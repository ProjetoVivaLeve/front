import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RatingStars } from "./rating-stars"
import { Users } from "lucide-react"

interface PsychologistCardProps extends React.HTMLAttributes<HTMLDivElement> {
  psychologist: {
    id: string
    name: string
    rating: number
    reviewCount: number
    email: string
  }
  compatibility?: number
}

const PsychologistCard = React.forwardRef<HTMLDivElement, PsychologistCardProps>(
  ({ className, psychologist, compatibility = 0, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn("overflow-hidden hover:shadow-lg transition-shadow", className)}
        {...props}
      >
        <div className="flex items-center p-4 border-b">
          <div className="h-16 w-16 rounded-full mr-4 overflow-hidden bg-muted">
            <div className="h-full w-full flex items-center justify-center text-xl font-semibold text-vivaleve-600">
              {psychologist.name.charAt(0)}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold">{psychologist.name}</h3>
            <div className="flex items-center text-sm">
              <RatingStars rating={psychologist.rating} />
              <span className="ml-1">{psychologist.rating}</span>
              <span className="text-muted-foreground ml-1">({psychologist.reviewCount})</span>
            </div>
            <div className="flex items-center text-sm">
              <p className="text-sm text-muted-foreground">{psychologist.email}</p>
            </div>
          </div>
          <div className="bg-vivaleve-50 text-vivaleve-700 px-3 py-2 rounded-full text-sm font-medium">
            {compatibility}% Compatível
          </div>
        </div>
        <CardContent className="p-4">
          <Button asChild className="w-full bg-vivaleve-600 hover:bg-vivaleve-700">
            <a href={`/psicologo/${psychologist.id}`}>
              Ver Perfil Completo
            </a>
          </Button>
        </CardContent>
      </Card>
    )
  }
)
PsychologistCard.displayName = "PsychologistCard"

export { PsychologistCard }