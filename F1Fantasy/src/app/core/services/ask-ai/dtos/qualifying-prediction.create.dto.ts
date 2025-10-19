import {DriverPredictionInputCreateDto} from './driver-prediction-input.create.dto';

export interface QualifyingPredictionCreateDto {
  circuitId: number;
  qualifyingDate: string; // DateTime -> ISO string
  entries: DriverPredictionInputCreateDto[];
}
