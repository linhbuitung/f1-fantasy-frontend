import {CircuitDto} from './circuit.get.dto';

export interface RaceDto {
  id: number;
  raceName: string;
  round: number;
  raceDate: string; // ISO date string
  deadlineDate: string; // ISO date string
  calculated: boolean;
  seasonYear?: number;
  circuit?: CircuitDto;
}
