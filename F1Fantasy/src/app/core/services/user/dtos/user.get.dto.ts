export interface UserGetDto {
  id: number;
  displayName: string | null;
  email: string;
  emailConfirmed: boolean;
  dateOfBirth: string | null;
  acceptNotification: boolean;
  consecutiveActiveDays: number;
  lastActiveAt: string;
  askAiCredits: number;
  constructorId: number | null;
  constructorName: string | null;
  driverId: number | null;
  driverName: string | null;
  countryId: string | null;
  countryName: string | null;
  roles: Role[];
}

export type Role = 'Player' | 'Admin' | 'SuperAdmin';
