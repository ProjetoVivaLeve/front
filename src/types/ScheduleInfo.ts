import { UserBasicInfo } from "./UserBasicInfo";

export interface ScheduleInfo {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  patient?: UserBasicInfo;
}