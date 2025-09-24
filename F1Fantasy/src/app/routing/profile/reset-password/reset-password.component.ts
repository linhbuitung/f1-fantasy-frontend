import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user/user.service';
import { passwordValidator } from '../../../core/utils/custom-validators';
import { UserResetPasswordDto } from '../../../core/services/user/dtos/reset-password.dto';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {ContentContainerComponent} from '../../../shared/content-container/content-container.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, ContentContainerComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  serverError: string | null = null;
  email: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      resetCode: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6), passwordValidator()]]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
  }

  sendResetCode() {
    const email = this.resetForm.controls['email'].value;
    if (!email || this.resetForm.controls['email'].invalid) return;
    this.userService.sendResetCode(email).subscribe({
      next: () => {
        this.serverError = 'Reset code sent to your email.';
      },
      error: (err) => {
        this.serverError = err?.error?.message || 'Failed to send reset code.';
      }
    });
  }

  onSubmit() {
    if (this.resetForm.invalid) return;
    const payload: UserResetPasswordDto = this.resetForm.value;
    this.userService.resetPassword(payload).subscribe({
      next: () => {
        this.serverError = 'Password changed successfully!';
        this.resetForm.reset();
      },
      error: (err) => {
        this.serverError = err?.error?.message || 'Failed to reset password.';
      }
    });
  }
}
