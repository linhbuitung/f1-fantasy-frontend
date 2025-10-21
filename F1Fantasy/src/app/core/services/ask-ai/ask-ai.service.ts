import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { PickableDriverGetDto } from './dtos/pickable-driver.get.dto';
import { PickableConstructorGetDto } from './dtos/pickable-constructor.get.dto';
import { PickableCircuitGetDto } from './dtos/pickable-circuit.get.dto';
import {PredictionGetDto} from './dtos/prediction.get.dto';
import {MainRacePredictionCreateAsNewDto} from './dtos/main-race-prediction-as-new.create.dto';
import {QualifyingPredictionCreateDto} from './dtos/qualifying-prediction.create.dto';
import {MainRacePredictionCreateAsAdditionDto} from './dtos/main-race-prediction-as-addition.create.dto';

@Injectable({ providedIn: 'root' })
export class AskAiService {
  constructor(private http: HttpClient) {}

  getMlPickableDriversForMainRace(): Observable<PickableDriverGetDto[]> {
    return this.http.get<PickableDriverGetDto[]>(
      `${environment.API_URL}/ask-ai/drivers/main-race`,
      { withCredentials: true }
    );
  }

  getMlPickableDriversForQualifying(): Observable<PickableDriverGetDto[]> {
    return this.http.get<PickableDriverGetDto[]>(
      `${environment.API_URL}/ask-ai/drivers/qualifying`,
      { withCredentials: true }
    );
  }

  getMlPickableConstructorsForMainRace(): Observable<PickableConstructorGetDto[]> {
    return this.http.get<PickableConstructorGetDto[]>(
      `${environment.API_URL}/ask-ai/constructors/main-race`,
      { withCredentials: true }
    );
  }

  getMlPickableConstructorsForQualifying(): Observable<PickableConstructorGetDto[]> {
    return this.http.get<PickableConstructorGetDto[]>(
      `${environment.API_URL}/ask-ai/constructors/qualifying`,
      { withCredentials: true }
    );
  }

  getMlPickableCircuitsForMainRace(): Observable<PickableCircuitGetDto[]> {
    return this.http.get<PickableCircuitGetDto[]>(
      `${environment.API_URL}/ask-ai/circuits/main-race`,
      { withCredentials: true }
    );
  }

  getMlPickableCircuitsForQualifying(): Observable<PickableCircuitGetDto[]> {
    return this.http.get<PickableCircuitGetDto[]>(
      `${environment.API_URL}/ask-ai/circuits/qualifying`,
      { withCredentials: true }
    );
  }

  getPredictionsByUser(userId: number, pageNum: number = 1, pageSize: number = 10): Observable<PredictionGetDto[]> {
    const params = new HttpParams()
      .set('pageNum', pageNum.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PredictionGetDto[]>(
      `${environment.API_URL}/ask-ai/user/${userId}/predictions`,
      { params, withCredentials: true }
    );
  }

  getPredictionDetailByUser(userId: number, predictionId: number): Observable<PredictionGetDto> {
    return this.http.get<PredictionGetDto>(
      `${environment.API_URL}/ask-ai/user/${userId}/prediction/${predictionId}`,
      { withCredentials: true }
    );
  }

  makeMainRacePredictionAsNew(userId: number, dto: MainRacePredictionCreateAsNewDto): Observable<PredictionGetDto> {
    return this.http.post<PredictionGetDto>(
      `${environment.API_URL}/ask-ai/user/${userId}/prediction/main-race`,
      dto,
      { withCredentials: true }
    );
  }

  makeQualifyingPrediction(userId: number, dto: QualifyingPredictionCreateDto): Observable<PredictionGetDto> {
    return this.http.post<PredictionGetDto>(
      `${environment.API_URL}/ask-ai/user/${userId}/prediction/qualifying`,
      dto,
      { withCredentials: true }
    );
  }

  makeMainRacePredictionFromExisting(
    userId: number,
    predictionId: number,
    dto: MainRacePredictionCreateAsAdditionDto
  ): Observable<PredictionGetDto> {
    return this.http.post<PredictionGetDto>(
      `${environment.API_URL}/ask-ai/user/${userId}/prediction/${predictionId}/main-race`,
      dto,
      { withCredentials: true }
    );
  }

}
