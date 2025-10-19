import {DriverInDriverPreditionGetDto} from './driver-in-driver-prediction.get.dto';
import {ConstructorInDriverPredictionGetDto} from './constructor-in-driver-prediction.get.dto';

export interface DriverPredictionGetDto {
  id: number;
  gridPosition?: number | null;
  finalPosition?: number | null;
  crashed: boolean;
  predictionId: number;
  driver: DriverInDriverPreditionGetDto;
  constructor: ConstructorInDriverPredictionGetDto;
}
