export interface GroupedAvailability {
  day: string;
  date: string;
  slots: {
    id: string;
    time: string;
  }[];
}