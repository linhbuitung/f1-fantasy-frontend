export interface NotificationGetDto {
  id: number;
  userId: number;
  header: string;
  content: string;
  createdAt: string; // ISO date string
  readAt?: string | null;   // ISO date string or undefined
}
