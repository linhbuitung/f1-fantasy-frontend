import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AskAiService } from '../../../../core/services/ask-ai/ask-ai.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { PredictionGetDto } from '../../../../core/services/ask-ai/dtos/prediction.get.dto';
import { DriverPredictionGetDto } from '../../../../core/services/ask-ai/dtos/driver-in-prediction.get.dto';
import { ContentContainerComponent } from '../../../../shared/content-container/content-container.component';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import {
  MainRacePredictionCreateAsAdditionDto
} from '../../../../core/services/ask-ai/dtos/main-race-prediction-as-addition.create.dto';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-prediction-detail',
  standalone: true,
  imports: [ContentContainerComponent, CommonModule, DatePipe, NgFor, NgIf, RouterLink, FormsModule],
  templateUrl: './prediction-detail.component.html',
  styleUrl: './prediction-detail.component.scss'
})
export class PredictionDetailComponent implements OnInit {
  prediction: PredictionGetDto | null = null;
  loading = true;
  error: string | null = null;
  currentUserId: number | null = null;

  showAddMainForm = false;
  addingMainLoading = false;
  addMainModel: { laps: number; raceDate: string; rain: boolean } = { laps: 0, raceDate: '', rain: false };
  addMainError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private askAi: AskAiService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.userProfile$.subscribe(u => {
      this.currentUserId = u?.id ?? null;
      this.loadPrediction();
    });
  }

  loadPrediction() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.currentUserId || !id) {
      this.error = 'Invalid prediction or user.';
      this.loading = false;
      return;
    }
    this.askAi.getPredictionDetailByUser(this.currentUserId, id).subscribe({
      next: (p) => {
        this.prediction = p;
        this.loading = false;
      },
      error: () => {
        this.error = 'Prediction not found or access denied.';
        this.loading = false;
      }
    });
  }

  hasMainRace(pred: PredictionGetDto | null): boolean {
    return !!(pred && (pred.isRaceCalculated || pred.raceDate));
  }

  get sortedDriverPredictions(): DriverPredictionGetDto[] {
    return (this.prediction?.driverPredictions ?? []).slice().sort((a, b) => {
      const aVal = a.finalPosition ?? Number.POSITIVE_INFINITY;
      const bVal = b.finalPosition ?? Number.POSITIVE_INFINITY;
      return aVal - bVal;
    });
  }

  toggleAddMainForm() {
    this.showAddMainForm = !this.showAddMainForm;
    this.addMainError = null;
    if (this.prediction) this.addMainModel.raceDate = this.prediction.qualifyingDate ?? this.addMainModel.raceDate;
  }

  get addMainValidationErrors(): string[] {
    const errs: string[] = [];
    const laps = Number(this.addMainModel.laps);
    if (!Number.isFinite(laps) || !Number.isInteger(laps) || laps < 1) {
      errs.push('Laps must be an integer of at least 1.');
    }
    if (!this.addMainModel.raceDate) {
      errs.push('Race date is required.');
      return errs;
    }
    const raceDate = new Date(this.addMainModel.raceDate);
    if (isNaN(raceDate.getTime())) {
      errs.push('Race date is invalid.');
      return errs;
    }
    if (raceDate.getTime() <= Date.now()) {
      errs.push('Race date must be in the future.');
    }
    if (this.prediction?.qualifyingDate) {
      const qualDate = new Date(this.prediction.qualifyingDate);
      if (!isNaN(qualDate.getTime()) && raceDate.getTime() <= qualDate.getTime()) {
        errs.push('Race date must be after the qualifying date.');
      }
    }
    return errs;
  }

  get isAddMainValid(): boolean {
    return this.addMainValidationErrors.length === 0;
  }

  submitAddMain() {
    if (!this.currentUserId || !this.prediction) return;
    const validation = this.addMainValidationErrors;
    if (validation.length > 0) {
      this.addMainError = validation.join(' ');
      return;
    }
    this.addingMainLoading = true;
    this.addMainError = null;
    const dto: MainRacePredictionCreateAsAdditionDto = {
      laps: Number(this.addMainModel.laps),
      raceDate: new Date(this.addMainModel.raceDate).toISOString(),
      rain: Boolean(this.addMainModel.rain)
    };
    this.askAi.makeMainRacePredictionFromExisting(this.currentUserId, this.prediction.id, dto).subscribe({
      next: (updated) => {
        this.prediction = updated;
        this.showAddMainForm = false;
        this.addingMainLoading = false;
        this.auth.reloadProfile();
      },
      error: (err) => {
        this.addMainError = err?.error?.message || 'Failed to add main race';
        this.addingMainLoading = false;
      }
    });
  }
}
