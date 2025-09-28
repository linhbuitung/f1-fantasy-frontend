export interface DriverInTeamOfTheRaceDto {
  id: number;
  name: string;
  pointGained: number;
  imgUrl?: string | null;
}

export interface ConstructorInTeamOfTheRaceDto {
  id: number;
  name: string;
  pointGained: number;
  imgUrl?: string | null;
}

export interface TeamOfTheRaceDto {
  id: number;
  raceName: string;
  round: number;
  drivers: DriverInTeamOfTheRaceDto[];
  constructors: ConstructorInTeamOfTheRaceDto[];
}
