import {Component, OnInit} from '@angular/core';
import {AskAiService} from '../../../../core/services/ask-ai/ask-ai.service';
import {AuthService} from '../../../../core/services/auth/auth.service';
import {ContentContainerComponent} from '../../../../shared/content-container/content-container.component';
import {CommonModule, DatePipe, NgFor, NgIf} from '@angular/common';
import {PredictionGetDto} from '../../../../core/services/ask-ai/dtos/prediction.get.dto';
import {environment} from '../../../../../environments/environment';
import {
  MainRacePredictionCreateAsAdditionDto
} from '../../../../core/services/ask-ai/dtos/main-race-prediction-as-addition.create.dto';
import {FormsModule} from '@angular/forms';
import {DriverPredictionGetDto} from '../../../../core/services/ask-ai/dtos/driver-in-prediction.get.dto';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-ask-ai-landing-page',
  imports: [ContentContainerComponent, CommonModule, DatePipe, NgFor, NgIf, FormsModule, RouterLink],
  templateUrl: './ask-ai-landing-page.component.html',
  styleUrl: './ask-ai-landing-page.component.scss'
})
export class AskAiLandingPageComponent implements OnInit {
  predictions: PredictionGetDto[] = [];
  selected: PredictionGetDto | null = null;
  currentUserId: number | null = null;
  pageNum = 1;
  pageSize = environment.PAGE_SIZE ?? 10;
  loadingList = false;
  loadingDetail = false;
  hasMore = false;

  // New: user credits & inline main-race form state
  predictionsLeft = 0;
  showAddMainForm = false;
  addingMainLoading = false;
  addMainModel: { laps: number; raceDate: string; rain: boolean } = { laps: 58, raceDate: '', rain: false };
  addMainError: string | null = null;

  constructor(private askAi: AskAiService, private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.userProfile$.subscribe((u) => {
      this.currentUserId = u?.id ?? null;
      this.predictionsLeft = u?.askAiCredits ?? 0;
      if (this.currentUserId) {
        this.loadPredictions(this.pageNum);
      }
    });
  }

  loadPredictions(page: number = 1) {
    if (!this.currentUserId) return;
    this.loadingList = true;
    this.pageNum = page;
    this.askAi.getPredictionsByUser(this.currentUserId, this.pageNum, this.pageSize).subscribe({
      next: (data) => {
        this.predictions = data || [];
        this.hasMore = this.predictions.length === this.pageSize;
        if (!this.selected && this.predictions.length > 0) {
          this.selectPrediction(this.predictions[0].id);
        } else if (this.selected) {
          const found = this.predictions.find((p) => p.id === this.selected!.id);
          if (!found) this.selected = null;
        }
        this.loadingList = false;
      },
      error: () => {
        this.predictions = [];
        this.loadingList = false;
      }
    });
  }

  selectPrediction(predictionId: number) {
    if (!this.currentUserId) return;
    this.loadingDetail = true;
    this.showAddMainForm = false;
    this.addMainError = null;
    this.askAi.getPredictionDetailByUser(this.currentUserId, predictionId).subscribe({
      next: (p) => {
        this.selected = p;
        // prefill raceDate from qualifying if present
        this.addMainModel.raceDate = p.qualifyingDate ?? '';
        this.loadingDetail = false;
      },
      error: () => {
        this.selected = null;
        this.loadingDetail = false;
      }
    });
  }

  prevPage() {
    if (this.pageNum <= 1) return;
    this.loadPredictions(this.pageNum - 1);
  }

  nextPage() {
    if (!this.hasMore) return;
    this.loadPredictions(this.pageNum + 1);
  }

  hasMainRace(pred: PredictionGetDto) {
    return Boolean(pred.isRaceCalculated || pred.raceDate);
  }

  // Toggle the inline form
  toggleAddMainForm() {
    this.showAddMainForm = !this.showAddMainForm;
    this.addMainError = null;
    if (this.selected) this.addMainModel.raceDate = this.selected.qualifyingDate ?? this.addMainModel.raceDate;
  }

  submitAddMain() {
    if (!this.currentUserId || !this.selected) return;
    this.addingMainLoading = true;
    this.addMainError = null;

    const dto: MainRacePredictionCreateAsAdditionDto = {
      laps: Number(this.addMainModel.laps),
      raceDate: new Date(this.addMainModel.raceDate).toISOString(),
      rain: Boolean(this.addMainModel.rain)
    };

    this.askAi.makeMainRacePredictionFromExisting(this.currentUserId, this.selected.id, dto).subscribe({
      next: (updated) => {
        this.selected = updated;
        // refresh list so badge updates
        this.loadPredictions(this.pageNum);
        this.showAddMainForm = false;
        this.addingMainLoading = false;
      },
      error: (err) => {
        this.addMainError = err?.error?.message || 'Failed to add main race';
        this.addingMainLoading = false;
      }
    });
  }

  get sortedDriverPredictions(): DriverPredictionGetDto[] {
    return (this.selected?.driverPredictions ?? []).slice().sort((a, b) => {
      const aVal = a.finalPosition ?? Number.POSITIVE_INFINITY;
      const bVal = b.finalPosition ?? Number.POSITIVE_INFINITY;
      return aVal - bVal;
    });
  }
}
