import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { LeagueGetDto } from './dtos/league.get.dto';
import {LeagueCreateDto} from './dtos/league.create.dto';
import {JoinRequestGetDto} from './dtos/join-request.get.dto';
import {LeagueUpdateDto} from './dtos/league.update.dto';
import {JoinRequestUpdateDto} from './dtos/join-request.update.dto';
import {LeagueSearchResultDto} from './dtos/league-search-result.dto';
import {HttpParams} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class LeagueService {
  constructor(private http: HttpClient) {}
  getLeagueWithPlayersByIdPaged(leagueId: number, pageNum: number = 1, pageSize: number = 10): Observable<LeagueGetDto> {
    const params = { pageNum, pageSize };
    return this.http.get<LeagueGetDto>(
      `${environment.API_URL}/league/${leagueId}`,
      { params, withCredentials: true }
    );
  }

  getJoinRequestsByLeagueIdAndOwnerId(leagueId: number, ownerId: number): Observable<JoinRequestGetDto[]> {
    return this.http.get<JoinRequestGetDto[]>(
      `${environment.API_URL}/owner/${ownerId}/league/${leagueId}/join-requests`,
      { withCredentials: true }
    );
  }

  getOwnedLeagues(userId: number): Observable<LeagueGetDto[]> {
    return this.http.get<LeagueGetDto[]>(
      `${environment.API_URL}/user/${userId}/league/owned`,
      { withCredentials: true }
    );
  }

  getJoinedLeagues(userId: number): Observable<LeagueGetDto[]> {
    return this.http.get<LeagueGetDto[]>(
      `${environment.API_URL}/user/${userId}/league/joined`,
      { withCredentials: true }
    );
  }

  createPrivateLeague(userId: number, dto: LeagueCreateDto): Observable<LeagueGetDto> {
    return this.http.post<LeagueGetDto>(
      `${environment.API_URL}/user/${userId}/league/private`,
      dto,
      { withCredentials: true }
    );
  }

  updatePrivateLeague(userId: number, dto: LeagueUpdateDto): Observable<LeagueGetDto> {
    return this.http.put<LeagueGetDto>(
      `${environment.API_URL}/user/${userId}/league/${dto.id}`,
      dto,
      { withCredentials: true }
    );
  }

  handleJoinRequest(ownerId: number, leagueId: number, dto: JoinRequestUpdateDto): Observable<JoinRequestGetDto> {
    return this.http.put<JoinRequestGetDto>(
      `${environment.API_URL}/user/${ownerId}/league/${leagueId}/handle-join-request`,
      dto,
      { withCredentials: true }
    );
  }

  DeletePrivateLeague(userId: number, leagueId: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.API_URL}/user/${userId}/league/${leagueId}`,
      { withCredentials: true }
    );
  }

  SearchLeagues(query: string, pageNum: number = 1, pageSize: number = 10): Observable<LeagueSearchResultDto> {
    const params = new HttpParams()
      .set('query', query)
      .set('pageNum', pageNum)
      .set('pageSize', pageSize);

    return this.http.get<LeagueSearchResultDto>(
      `${environment.API_URL}/league/full-text-search`,
      { params, withCredentials: true }
    );
  }

  kickUserFromLeague( userId: number, leagueId: number, playerId: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.API_URL}/user/${userId}/league/${leagueId}/kick/${playerId}`,
      { withCredentials: true }
    );
  }

  getJoinRequestForUserInLeague(userId: number, leagueId: number): Observable<JoinRequestGetDto | null> {
    return this.http.get<JoinRequestGetDto | null>(
      `${environment.API_URL}/user/${userId}/league/${leagueId}/join-request`,
      { withCredentials: true }
    );
  }

  joinLeague(userId: number, leagueId: number): Observable<JoinRequestGetDto> {
    return this.http.post<JoinRequestGetDto>(
      `${environment.API_URL}/user/${userId}/league/${leagueId}/join`,
      {},
      { withCredentials: true }
    );
  }

  leaveLeague(userId: number, leagueId: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.API_URL}/user/${userId}/league/${leagueId}/leave`,
      { withCredentials: true }
    );
  }
}
