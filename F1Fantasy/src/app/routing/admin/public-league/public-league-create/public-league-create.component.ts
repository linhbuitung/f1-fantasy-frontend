import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { LeagueCreateDto } from '../../../../core/services/leagues/dtos/league.create.dto';

@Component({
  selector: 'app-public-league-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './public-league-create.component.html',
  styleUrl: './public-league-create.component.scss'
})
export class PublicLeagueCreateComponent implements OnInit {
  createForm: FormGroup;
  submitting = false;
  serverError: string | null = null;
  successMessage: string | null = null;
  currentUserId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {
    this.createForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      maxPlayersNum: [10, [Validators.required, Validators.min(2), Validators.max(100)]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.authService.userProfile$.subscribe(u => {
      this.currentUserId = u?.id ?? null;
    });
  }

  onSubmit() {
    this.serverError = null;
    this.successMessage = null;
    if (this.createForm.invalid || !this.currentUserId) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload: LeagueCreateDto = {
      maxPlayersNum: Number(this.createForm.value.maxPlayersNum),
      name: String(this.createForm.value.name).trim(),
      description: (this.createForm.value.description || '').trim(),
      ownerId: this.currentUserId
    };

    this.adminService.createPublicLeague(this.currentUserId, payload).subscribe({
      next: () => {
        this.successMessage = 'Public league created successfully!';
        this.submitting = false;
        // Navigate to manager area (keeps with app admin pattern)
        this.router.navigateByUrl('/admin/public-league/manage');
      },
      error: (err) => {
        this.serverError = err?.error?.message || 'Failed to create public league. Please try again.';
        this.submitting = false;
      }
    });
  }
}
