import { Component, OnInit } from '@angular/core';
import { ContentContainerComponent } from '../../../../shared/content-container/content-container.component';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {
  ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn, FormsModule, FormArray,
  FormGroup
} from '@angular/forms';
import { AskAiService } from '../../../../core/services/ask-ai/ask-ai.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { PickableDriverGetDto } from '../../../../core/services/ask-ai/dtos/pickable-driver.get.dto';
import { PickableConstructorGetDto } from '../../../../core/services/ask-ai/dtos/pickable-constructor.get.dto';
import { PickableCircuitGetDto } from '../../../../core/services/ask-ai/dtos/pickable-circuit.get.dto';
import { MainRacePredictionCreateAsNewDto } from '../../../../core/services/ask-ai/dtos/main-race-prediction-as-new.create.dto';
import { DriverPredictionInputCreateDto } from '../../../../core/services/ask-ai/dtos/driver-prediction-input.create.dto';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-create-main-race',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, ContentContainerComponent, RouterLink],
  templateUrl: './create-main-race.component.html',
  styleUrl: './create-main-race.component.scss'
})
export class CreateMainRaceComponent implements OnInit {
  pickableDrivers: PickableDriverGetDto[] = [];
  pickableConstructors: PickableConstructorGetDto[] = [];
  pickableCircuits: PickableCircuitGetDto[] = [];
  loading = false;
  submitting = false;
  serverError: string | null = null;
  currentUserId: number | null = null;
  predictionsLeft = 0;

  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private askAi: AskAiService,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
    circuitId: [null, Validators.required],
    qualifyingDate: ['', [Validators.required, this.futureDateValidator()]],
    raceDate: ['', [Validators.required, this.futureDateValidator()]],
    laps: [58, [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]],
    rain: [false],
    entries: this.fb.array([], this.uniqueDriverConstructorPairValidator())
  }, { validators: [
        this.raceAfterQualifyingValidator(),
        this.everyQualPositionExistValidator()
      ] });
  }

  ngOnInit(): void {
    this.auth.reloadProfile();
    this.auth.userProfile$.subscribe((u) => {
      this.currentUserId = u?.id ?? null;
      this.predictionsLeft = u?.askAiCredits ?? 0;
    });

    this.loading = true;
    forkJoin({
      drivers: this.askAi.getMlPickableDriversForMainRace(),
      constructors: this.askAi.getMlPickableConstructorsForMainRace(),
      circuits: this.askAi.getMlPickableCircuitsForMainRace()
    }).subscribe({
      next: ({ drivers, constructors, circuits }) => {
        this.pickableDrivers = drivers.sort((a, b) => a.givenName.localeCompare(b.givenName)) || [];
        this.pickableConstructors = constructors.sort((a, b) => a.name.localeCompare(b.name)) || [];
        this.pickableCircuits = circuits.sort((a, b) => a.circuitName.localeCompare(b.circuitName)) || [];
        if (this.entriesControl.length === 0) this.addEntry();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  get entriesControl(): FormArray {
    return this.form.get('entries') as FormArray;
  }
  addEntry() {
    const group = this.fb.group({
      qualificationPosition: [null, [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]],
      constructorId: [null, Validators.required],
      driverId: [null, Validators.required]
    });
    this.entriesControl.push(group);
    this.entriesControl.updateValueAndValidity();
  }

  removeEntry(index: number) {
    this.entriesControl.removeAt(index);
    this.entriesControl.updateValueAndValidity();
  }

  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const val = new Date(control.value);
      if (isNaN(val.getTime())) return { invalidDate: true };
      return val.getTime() > Date.now() ? null : { notInFuture: true };
    };
  }

  uniqueDriverConstructorPairValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const arr = control.value as any[] | null;
      if (!arr || arr.length === 0) return null;
      const seen = new Set<string>();
      for (const e of arr) {
        const d = e?.driverId;
        const c = e?.constructorId;
        if (d == null || c == null) continue;
        const key = `${d}-${c}`;
        if (seen.has(key)) return { duplicatePair: key };
        seen.add(key);
      }
      return null;
    };
  }

  raceAfterQualifyingValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const q = group.get('qualifyingDate')?.value;
      const r = group.get('raceDate')?.value;
      if (!q || !r) return null;
      const qd = new Date(q);
      const rd = new Date(r);
      if (isNaN(qd.getTime()) || isNaN(rd.getTime())) return null;
      return rd.getTime() > qd.getTime() ? null : { raceNotAfterQualifying: true };
    };
  }

everyQualPositionExistValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const entries = (group.get('entries') as FormArray)?.value;
    if (!entries || entries.length === 0) return { noQualPosition: true };
    const allHaveQual = entries.every((e: any) => Number.isFinite(e.qualificationPosition) && e.qualificationPosition > 0);
    return allHaveQual ? null : { noQualPosition: true };
  };
  }
  onSubmit() {
    this.serverError = null;
    if (this.form.invalid || !this.currentUserId) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload: MainRacePredictionCreateAsNewDto = {
      laps: Number(this.form.value.laps),
      circuitId: Number(this.form.value.circuitId),
      raceDate: new Date(this.form.value.raceDate).toISOString(),
      qualifyingDate: new Date(this.form.value.qualifyingDate).toISOString(),
      rain: Boolean(this.form.value.rain),
      entries: (this.form.value.entries || []).map((e: any): DriverPredictionInputCreateDto => ({
        qualificationPosition: Number(e.qualificationPosition),
        constructorId: Number(e.constructorId),
        driverId: Number(e.driverId)
      }))
    };

    this.askAi.makeMainRacePredictionAsNew(this.currentUserId, payload).subscribe({
      next: (created) => {
        this.submitting = false;
        this.router.navigate(['/fantasy/ask-ai/prediction', created.id]);
      },
      error: (err) => {
        this.serverError = err?.error?.message || 'Failed to create prediction';
        this.submitting = false;
      }
    });
  }
}
