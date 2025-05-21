import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PsychologistCard } from "./psychologist-card"
import { Users } from "lucide-react"

interface PsychologistsRecommendedProps extends React.HTMLAttributes<HTMLDivElement> {
  psychologists: Array<{
    id: string
    name: string
    rating: number
    reviewCount: number
    email: string
  }>
  emptyMessage?: string
}

const PsychologistsRecommended = React.forwardRef<HTMLDivElement, PsychologistsRecommendedProps>(
  ({ className, psychologists, emptyMessage = "Nenhum psicólogo recomendado encontrado.", ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn("mb-10", className)}
        {...props}
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Users className="w-6 h-6 mr-2 text-vivaleve-600" />
          Psicólogos Recomendados para Você
        </h2>
        
        {psychologists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {psychologists.map((psychologist) => (
              <PsychologistCard 
                key={psychologist.id} 
                psychologist={psychologist} 
                compatibility={Math.floor(Math.random() * 50) + 20} // Exemplo aleatório
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="mb-4 text-muted-foreground">{emptyMessage}</p>
              <Button variant="outline" asChild>
                <a href="/psicologos">
                  Ver Todos os Psicólogos
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    )
  }
)
PsychologistsRecommended.displayName = "PsychologistsRecommended"

export { PsychologistsRecommended }