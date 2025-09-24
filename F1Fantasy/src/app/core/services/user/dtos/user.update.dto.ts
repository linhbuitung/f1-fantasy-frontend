export interface UserUpdateDto {
  id: number;
  displayName: string | null;
  dateOfBirth: string | null;
  acceptNotification: boolean;
  constructorId: number | null;
  driverId: number | null;
  countryId: string | null;
}
