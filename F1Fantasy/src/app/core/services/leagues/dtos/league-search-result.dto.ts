import { LeagueGetDto } from './league.get.dto';

export interface LeagueSearchResultDto {
  items: LeagueGetDto[];
  total: number;
  pageNum: number;
  pageSize: number;
}
