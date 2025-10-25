import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DriverGetDto} from '../static-data/dtos/driver.get.dto';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {ImgUpdateDto} from './dtos/img-update.dto';
import {ConstructorGetDto} from '../static-data/dtos/constructor.get.dto';
import {CircuitGetDto} from '../static-data/dtos/circuit.get.dto';
import {PowerupGetDto} from '../static-data/dtos/powerup.get.dto';
import {LeagueCreateDto} from '../leagues/dtos/league.create.dto';
import {LeagueGetDto} from '../leagues/dtos/league.get.dto';
import {LeagueUpdateDto} from '../leagues/dtos/league.update.dto';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {

  }
  updateDriverImage(driverId: number, dto: ImgUpdateDto): Observable<DriverGetDto> {
    const fd = this.toFormData(dto);
    return this.http.patch<DriverGetDto>(
      `${environment.API_URL}/admin/driver/${driverId}`,
      fd,
      { withCredentials: true }
    );
  }

  updateConstructorImage(constructorId: number, dto: ImgUpdateDto): Observable<ConstructorGetDto> {
    const fd = this.toFormData(dto);
    return this.http.patch<ConstructorGetDto>(
      `${environment.API_URL}/admin/constructor/${constructorId}`,
      fd,
      { withCredentials: true }
    );
  }

  updateCircuitImage(circuitId: number, dto: ImgUpdateDto): Observable<CircuitGetDto> {
    const fd = this.toFormData(dto);
    return this.http.patch<CircuitGetDto>(
      `${environment.API_URL}/admin/circuit/${circuitId}`,
      fd,
      { withCredentials: true }
    );
  }

  updatePowerupImage(powerupId: number, dto: ImgUpdateDto): Observable<PowerupGetDto> {
    const fd = this.toFormData(dto);
    return this.http.patch<PowerupGetDto>(
      `${environment.API_URL}/admin/powerup/${powerupId}`,
      fd,
      { withCredentials: true }
    );
  }

  private toFormData(dto: ImgUpdateDto): FormData {
    const fd = new FormData();
    fd.append('Id', String(dto.id));
    fd.append('Img', dto.file, dto.file.name);
    return fd;
  }


  createPublicLeague(userId: number, dto: LeagueCreateDto): Observable<LeagueGetDto> {
    return this.http.post<LeagueGetDto>(
      `${environment.API_URL}/admin/${userId}/league/public`,
      dto,
      { withCredentials: true }
    );
  }

  updatePublicLeague(userId: number, dto: LeagueUpdateDto): Observable<LeagueGetDto> {
    return this.http.put<LeagueGetDto>(
      `${environment.API_URL}/admin/${userId}/league/${dto.id}`,
      dto,
      { withCredentials: true }
    );
  }

  DeleteLeague(userId: number, leagueId: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.API_URL}/user/${userId}/league/${leagueId}`,
      { withCredentials: true }
    );
  }

}
