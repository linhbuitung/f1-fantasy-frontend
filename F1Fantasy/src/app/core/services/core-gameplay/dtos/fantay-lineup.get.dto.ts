export interface DriverInFantasyLineupDto {
  id: number;
  givenName: string;
  familyName: string;
  isCaptain: boolean;
  dateOfBirth: string; // ISO string
  countryId: string;
  code: string;
  price: number;
  imgUrl?: string | null;
}

export interface ConstructorInFantasyLineupDto {
  id: number;
  name: string;
  code: string;
  price: number;
  imgUrl?: string | null;
  countryId: string;
}

export interface PowerupInFantasyLineupDto {
  id: number;
  type: string;
  description: string;
  imgUrl: string;
}

export interface FantasyLineupDto {
  id: number;
  totalAmount: number;
  transfersMade: number;
  pointsGained: number;
  userId: number;
  raceId: number;
  drivers: DriverInFantasyLineupDto[];
  constructors: ConstructorInFantasyLineupDto[];
  powerups: PowerupInFantasyLineupDto[];
}
