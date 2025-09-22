export interface UserProfileDto {
  id: number;
  displayName: string | null;
  email: string;
  dateOfBirth: string | null;
  acceptNotification: boolean;
  consecutiveActiveDays: number;
  lastActiveAt: string;
  askAiCredits: number;
  constructorId: number | null;
  constructorName: string | null;
  driverId: number | null;
  driverName: string | null;
  countryId: number | null;
  countryName: string | null;
}