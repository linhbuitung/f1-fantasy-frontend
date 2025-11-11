export interface RaceStatisticMinimalGetDto {
  id: number;
  raceName: string;
  round: number;
  raceDate: string; // ISO string
  deadlineDate: string; // ISO string
  calculated: boolean;
  seasonId?: number | null;
  circuitId: number | null;
  circuitCode?: string | null;
}

export interface CircuitInRaceStatisticDto {
  circuitName: string;
  code: string;
  country: string;
  imgUrl?: string | null;
}

export interface DriverInRaceStatisticDto {
  id: number;
  givenName: string;
  familyName: string;
  constructorName: string;
  imgUrl?: string | null;
  position?: number | null;
  grid?: number | null;
  fastestLap?: number | null;
  pointsGained: number;
  finished: boolean;
}

export interface ConstructorInRaceStatisticDto {
  id: number;
  name: string;
  imgUrl?: string | null;
  pointsGained: number;
}

export interface RaceStatisticGetDto {
  id: number;
  raceName: string;
  round: number;
  raceDate: string;     // ISO date string
  deadlineDate: string; // ISO date string
  calculated: boolean;
  circuit: CircuitInRaceStatisticDto;
  driversStatistics: DriverInRaceStatisticDto[];
  constructorsStatistics: ConstructorInRaceStatisticDto[];
}
