export interface DriverStatisticGetDto {
  id: number;
  givenName: string;
  familyName: string;
  code: string;
  price: number;
  imgUrl?: string | null;
}

export interface DriverWithTotalFantasyPointScoredGetDto extends DriverStatisticGetDto {
  totalFantasyPointScored: number;
}

export interface DriverWithAverageFantasyPointScoredGetDto extends DriverStatisticGetDto {
  averageFantasyPointScored: number;
}

export interface DriverWithSelectionPercentageGetDto extends DriverStatisticGetDto {
  selectionPercentage: number;
}

export interface DriverWithRaceWinsGetDto extends DriverStatisticGetDto {
  totalRacesWin: number;
}

export interface DriverWithPodiumsGetDto extends DriverStatisticGetDto {
  totalPodiums: number;
}

export interface DriverWithTop10FinishesGetDto extends DriverStatisticGetDto {
  totalTop10Finishes: number;
}

export interface DriverWithFastestLapsGetDto extends DriverStatisticGetDto {
  totalFastestLaps: number;
}

export interface DriverWithDnfsGetDto extends DriverStatisticGetDto {
  totalDnfs: number;
}
