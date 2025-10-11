export interface BestRaceWeekOfAnUserDto {
  fantasyLineupId: number;
  raceName: string;
  totalAmount: number;
  raceDate: string;
}

export interface UserGeneralSeasonStatisticDto {
  totalPointsGained: number;
  totalTransfersMade: number;
  overallRank: number;
  bestRaceWeek: BestRaceWeekOfAnUserDto;
}
