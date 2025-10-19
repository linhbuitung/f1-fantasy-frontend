export interface PickableDriverGetDto {
  id: number;
  givenName: string;
  familyName: string;
  dateOfBirth: string; // ISO date string (backend DateOnly)
  code: string;
}
