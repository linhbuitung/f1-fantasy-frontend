export interface BestRaceWeekOfAnUserDto {
  fantasyLineupId: number;
  raceName: string;
  pointsGained: number;
  raceDate: string;
}

export interface UserGeneralSeasonStatisticDto {
  totalPointsGained: number;
  totalTransfersMade: number;
  overallRank: number;
  bestRaceWeek: BestRaceWeekOfAnUserDto;
}
