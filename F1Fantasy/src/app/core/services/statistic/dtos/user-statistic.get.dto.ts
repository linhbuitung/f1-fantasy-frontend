export interface UserStatisticGetDto {
  id: number;
  displayName?: string | null;
  email: string;
  joinDate: string; // ISO date string
}

export interface UserWithAveragePointScoredGetDto extends UserStatisticGetDto {
  averageFantasyPointScored: number;
}

export interface UserWithTotalFantasyPointScoredGetDto extends UserStatisticGetDto {
  totalFantasyPointScored: number;
}
