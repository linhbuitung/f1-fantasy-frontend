import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LeagueService } from '../../../../core/services/leagues/league.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import {Router, RouterLink} from '@angular/router';
import { ContentContainerComponent } from '../../../../shared/content-container/content-container.component';
import { CommonModule } from '@angular/common';
import {LeagueCreateDto} from '../../../../core/services/leagues/dtos/league.create.dto';

@Component({
  selector: 'app-league-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ContentContainerComponent, RouterLink],
  templateUrl: './league-create.component.html',
  styleUrl: './league-create.component.scss'
})
export class LeagueCreateComponent {
  createForm: FormGroup;
  submitting = false;
  serverError: string | null = null;
  successMessage: string | null = null;
  currentUserId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private leagueService: LeagueService,
    private authService: AuthService,
    private router: Router
  ) {
    this.createForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      maxPlayersNum: [10, [Validators.required, Validators.min(2), Validators.max(100)]],
      description: ['', [Validators.maxLength(500)]]
    });

    this.authService.userProfile$.subscribe(user => {
      this.currentUserId = user?.id ?? null;
    });
  }

  onSubmit() {
    if (this.createForm.invalid || !this.currentUserId) return;
    this.submitting = true;
    this.serverError = null;
    this.successMessage = null;

    const payload: LeagueCreateDto = {
      maxPlayersNum: this.createForm.value.maxPlayersNum,
      name: this.createForm.value.name,
      description: this.createForm.value.description?.trim() || "",
      ownerId: this.currentUserId
    };

    this.leagueService.createPrivateLeague(this.currentUserId, payload).subscribe({
      next: (result) => {
        this.successMessage = 'League created successfully!';
        this.submitting = false;
        this.createForm.reset({ maxPlayersNum: 10 });
        this.router.navigateByUrl(`/fantasy/leagues/${result.id}/manage`);
      },
      error: (err) => {
        this.serverError = err?.error?.message || 'Failed to create league. Please try again.';
        this.submitting = false;
      }
    });
  }
}
