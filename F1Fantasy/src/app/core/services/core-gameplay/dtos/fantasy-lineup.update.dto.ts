export interface FantasyLineupUpdateDto {
  id: number;
  captainDriverId?: number;
  driverIds: number[];
  constructorIds: number[];
}
