export interface DriverPredictionInputCreateDto {
  qualificationPosition?: number | null; // nullable int from backend
  constructorId: number;
  driverId: number;
}
