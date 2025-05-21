
export enum UserRole {
  PATIENT = "patient",
  PSYCHOLOGIST = "psychologist",
  ADMIN = "admin",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  imageUrl?: string;
  createdAt: Date;
}

export interface Patient extends User {
  role: UserRole.PATIENT;
  anamnesisCompleted: boolean;
  anamnesis?: Anamnesis;
}

export interface Psychologist extends User {
  role: UserRole.PSYCHOLOGIST;
  specialties: string[];
  biography: string;
  education: string[];
  experience: string[];
  rating: number;
  isApproved: boolean;
}

export interface Anamnesis {
  id: string;
  userId: string;
  answers: { questionId: number; answer: string | number }[];
  tags: string[];
  createdAt: Date;
}

export interface Session {
  id: string;
  patientId: string;
  psychologistId: string;
  date: Date;
  duration: number; // in minutes
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
}

export interface Chat {
  id: string;
  patientId: string;
  psychologistId: string;
  createdAt: Date;
  messages: Message[];
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
}

export interface ServiceRequest {
  id: string;
  patientId: string;
  psychologistId: string;
  status: "pending" | "accepted" | "declined";
  createdAt: Date;
}

export interface Review {
  id: string;
  patientId: string;
  psychologistId: string;
  sessionId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
