import * as React from "react"
import { cn } from "@/lib/utils"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { formatTime, getWeekdayNameTitle } from "@/helpers/DateHelper"
import { Patient, Psychologist } from "@/types"

interface AppointmentCardProps extends React.HTMLAttributes<HTMLLIElement> {
  appointment: {
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
}

const AppointmentCard = React.forwardRef<HTMLLIElement, AppointmentCardProps>(
  ({ className, appointment, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn(
          "p-4 hover:bg-muted/10 transition-colors",
          className
        )}
        {...props}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <div className="bg-vivaleve-100 p-2 rounded-full mr-3">
              <Clock className="w-4 h-4 text-vivaleve-600" />
            </div>
            <h3 className="font-medium">
              {appointment.psychologist.name}
            </h3>
          </div>
        </div>
        <div className="pl-11">
          <div className="text-sm text-muted-foreground flex justify-between items-center">
            <span>
              {getWeekdayNameTitle(new Date(appointment.schedule.date))} · 
              {formatTime(appointment.schedule.startTime)} - {formatTime(appointment.schedule.endTime)}
            </span>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="bg-vivaleve-600 hover:bg-vivaleve-700"
                asChild
              >
                <Link to={`/appointments/${appointment.id}`}>
                  Detalhes
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </li>
    )
  }
)
AppointmentCard.displayName = "AppointmentCard"

export { AppointmentCard }