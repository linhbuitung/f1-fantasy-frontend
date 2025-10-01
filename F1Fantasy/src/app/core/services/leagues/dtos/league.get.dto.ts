import {UserInLeagueDto} from './user-in-league.get.dto';
export enum LeagueType {
  Public = 'Public',
  Private = 'Private'
}

export interface LeagueGetDto {
  id: number;
  maxPlayersNum: number;
  type: LeagueType;
  name: string;
  description?: string | null;
  owner: UserInLeagueDto;
  users?: UserInLeagueDto[] | null;
}

