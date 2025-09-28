import { CircuitDto } from './circuit.get.dto';

export interface RaceDto {
  id: number;
  raceName: string;
  round: number;
  raceDate: string; // ISO string
  deadlineDate: string; // ISO string
  calculated: boolean;
  seasonYear: number;
  circuit: CircuitDto;
}