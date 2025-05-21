import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AppointmentCard } from "./appointment-card"
import { Calendar } from "lucide-react"
import { Link } from "react-router-dom"
import { Patient, Psychologist, UserRole } from "@/types"

interface Appointment {
  id: string
  psychologist: Psychologist,
  requester: Patient,
  status: 'pending' | 'accepted' | 'declined'
  message?: string
  schedule: {
    date: string
    startTime: string
    endTime: string
  }
}

interface AppointmentsListProps extends React.HTMLAttributes<HTMLDivElement> {
  appointments: Appointment[],
  role: UserRole,
  emptyMessage?: string
}

const AppointmentsList = React.forwardRef<HTMLDivElement, AppointmentsListProps>(
  ({ className, appointments, role, emptyMessage = "Você não tem sessões agendadas no momento.", ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn("mb-10", className)}
        {...props}
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-vivaleve-600" />
          Sessões Agendadas
        </h2>
        
        {appointments.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y">
                {appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    role={role}
                  />
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="mb-4 text-muted-foreground">{emptyMessage}</p>
              <Button variant="outline" asChild>
                <Link to="/schedule">
                  Agendar Sessão
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    )
  }
)
AppointmentsList.displayName = "AppointmentsList"

export { AppointmentsList }