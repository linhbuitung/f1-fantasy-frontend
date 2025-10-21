import {DriverPredictionInputCreateDto} from './driver-prediction-input.create.dto';

export interface MainRacePredictionCreateAsNewDto {
  laps: number;
  circuitId: number;
  raceDate: string; // DateTime -> ISO string
  qualifyingDate: string; // DateTime -> ISO string
  rain: boolean;
  entries?: DriverPredictionInputCreateDto[] | null;
}
