export interface ConstructorStatisticGetDto {
  id: number;
  name: string;
  code: string;
  price: number;
  imgUrl?: string | null;
}

export interface ConstructorWithAverageFantasyPointScoredGetDto extends ConstructorStatisticGetDto {
  averageFantasyPointScored: number;
}

export interface ConstructorWithSelectionPercentageGetDto extends ConstructorStatisticGetDto {
  selectionPercentage: number;
}

export interface ConstructorWithTotalFantasyPointScoredGetDto extends ConstructorStatisticGetDto {
  totalFantasyPointScored: number;
}

export interface ConstructorWithPodiumsGetDto extends ConstructorStatisticGetDto {
  totalPodiums: number;
}

export interface ConstructorWithTop10FinishesGetDto extends ConstructorStatisticGetDto {
  totalTop10Finishes: number;
}
