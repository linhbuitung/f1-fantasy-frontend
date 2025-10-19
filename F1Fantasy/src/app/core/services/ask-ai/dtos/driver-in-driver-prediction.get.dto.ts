export interface DriverInDriverPreditionGetDto {
  id: number;
  givenName: string;
  familyName: string;
  dateOfBirth: string; // DateOnly -> ISO date string
  code: string;
  imgUrl?: string | null;
}
