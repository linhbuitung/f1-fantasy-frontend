import {CircuitInPredictionGetDto} from './circuit-in-prediction.get.dto';
import {DriverPredictionGetDto} from './driver-in-prediction.get.dto';

export interface PredictionGetDto {
  id: number;
  datePredicted: string; // DateOnly -> ISO date string
  raceDate?: string | null; // DateTime? -> ISO string or null
  qualifyingDate: string; // ISO string
  rain: boolean;
  laps?: number | null;
  userId: number;
  isQualifyingCalculated: boolean;
  isRaceCalculated: boolean;
  circuit: CircuitInPredictionGetDto;
  driverPredictions?: DriverPredictionGetDto[] | null;
}
