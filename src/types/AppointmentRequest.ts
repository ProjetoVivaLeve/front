import { Psychologist, Patient } from ".";
import { ScheduleInfo } from "./ScheduleInfo";

export type AppointmentRequestStatus = 'pending' | 'accepted' | 'declined';

export interface AppointmentRequest {
  id: string;
  status: AppointmentRequestStatus;
  message: string;
  createdAt: string;
  schedule: ScheduleInfo;
  psychologist: Psychologist;
  requester: Patient;
}