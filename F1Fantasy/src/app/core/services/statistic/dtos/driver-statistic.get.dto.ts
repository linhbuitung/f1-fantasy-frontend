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
