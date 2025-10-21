import { Component, OnInit } from '@angular/core';
import { ContentContainerComponent } from '../../../../shared/content-container/content-container.component';
import { CommonModule } from '@angular/common';
import {Router, RouterLink, RouterModule} from '@angular/router';
import {
  ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn, FormsModule,
  FormGroup, FormArray
} from '@angular/forms';
import { AskAiService } from '../../../../core/services/ask-ai/ask-ai.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { PickableDriverGetDto } from '../../../../core/services/ask-ai/dtos/pickable-driver.get.dto';
import { PickableConstructorGetDto } from '../../../../core/services/ask-ai/dtos/pickable-constructor.get.dto';
import { PickableCircuitGetDto } from '../../../../core/services/ask-ai/dtos/pickable-circuit.get.dto';
import { QualifyingPredictionCreateDto } from '../../../../core/services/ask-ai/dtos/qualifying-prediction.create.dto';
import { DriverPredictionInputCreateDto } from '../../../../core/services/ask-ai/dtos/driver-prediction-input.create.dto';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-create-qualifying',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, ContentContainerComponent, RouterLink, RouterModule],
  templateUrl: './create-qualifying.component.html',
  styleUrl: './create-qualifying.component.scss'
})
export class CreateQualifyingComponent implements OnInit {
  pickableDrivers: PickableDriverGetDto[] = [];
  pickableConstructors: PickableConstructorGetDto[] = [];
  pickableCircuits: PickableCircuitGetDto[] = [];
  loading = false;
  submitting = false;
  serverError: string | null = null;
  currentUserId: number | null = null;
  form: FormGroup;
  predictionsLeft = 0;

  constructor(
    private fb: FormBuilder,
    private askAi: AskAiService,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      circuitId: [null, Validators.required],
      qualifyingDate: ['', [Validators.required, this.futureDateValidator()]],
      entries: this.fb.array([], this.uniqueDriverConstructorPairValidator())
    });

  }

  ngOnInit(): void {
    this.auth.reloadProfile();
    this.auth.userProfile$.subscribe((u) => {
      this.currentUserId = u?.id ?? null;
      this.predictionsLeft = u?.askAiCredits ?? 0;
    });

    this.loading = true;
    forkJoin({
      drivers: this.askAi.getMlPickableDriversForQualifying(),
      constructors: this.askAi.getMlPickableConstructorsForQualifying(),
      circuits: this.askAi.getMlPickableCircuitsForQualifying()
    }).subscribe({
      next: ({ drivers, constructors, circuits }) => {
        this.pickableDrivers = drivers || [];
        this.pickableConstructors = constructors || [];
        this.pickableCircuits = circuits || [];
        // start with a single empty entry
        if ((this.entriesControl.value ?? []).length === 0) {
          this.addEntry();
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // helper getters
  get entriesControl() {
    return this.form.get('entries')! as FormArray;
  }

  addEntry() {
    const group = this.fb.group({
      constructorId: [null, Validators.required],
      driverId: [null, Validators.required]
    });
    this.entriesControl.push(group);
    // re-run pair validator
    this.entriesControl.updateValueAndValidity();
  }


  removeEntry(index: number) {
    this.entriesControl.removeAt(index);
    this.entriesControl.updateValueAndValidity();
  }

  // Validator: qualifying date in future
  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      try {
        const val = new Date(control.value);
        if (isNaN(val.getTime())) return { invalidDate: true };
        return val.getTime() > Date.now() ? null : { notInFuture: true };
      } catch {
        return { invalidDate: true };
      }
    };
  }

  // Validator: unique driver-constructor pair
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
        if (seen.has(key)) {
          return { duplicatePair: key };
        }
        seen.add(key);
      }
      return null;
    };
  }

  // Submit
  onSubmit() {
    this.serverError = null;
    if (this.form.invalid || !this.currentUserId) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload: QualifyingPredictionCreateDto = {
      circuitId: Number(this.form.value.circuitId),
      qualifyingDate: new Date(this.form.value.qualifyingDate).toISOString(),
      entries: (this.form.value.entries || []).map((e: any): DriverPredictionInputCreateDto => ({
        // qualificationPosition omitted in the form -> explicitly send null
        qualificationPosition: null,
        constructorId: Number(e.constructorId),
        driverId: Number(e.driverId)
      }))
    };

    this.askAi.makeQualifyingPrediction(this.currentUserId, payload).subscribe({
      next: (created) => {
        // navigate back to ask-ai landing and select created prediction (backend returns PredictionGetDto)
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
