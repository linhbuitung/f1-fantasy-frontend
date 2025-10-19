export interface CircuitInPredictionGetDto {
  id: number;
  circuitName: string;
  code: string;
  latitude: number;
  longitude: number;
  locality: string;
  countryId: string;
  imgUrl?: string | null;
}
