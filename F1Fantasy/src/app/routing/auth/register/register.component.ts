import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { passwordValidator } from '../../../core/utils/custom-validators';
import { RegisterDto } from '../../../core/dtos/register.dtos';
import { ContentContainerComponent } from '../../../shared/content-container/content-container.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, ContentContainerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  serverError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(100)]
      ],
      password: [
        '',
        [Validators.required, Validators.minLength(6), passwordValidator()]
      ]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;
    const payload: RegisterDto = this.registerForm.value;
    this.authService.register(payload).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.serverError = this.getErrorMessage(err);
      }
    });
  }

  private getErrorMessage(err: any): string {
    if (err?.error?.message) return err.error.message;
    if (err?.message) return err.message;
    return 'Registration failed. Please try again.';
  }
}
