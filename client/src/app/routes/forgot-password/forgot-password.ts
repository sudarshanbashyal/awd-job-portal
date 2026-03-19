// packages
import {
  FormGroup,
  Validators,
  FormBuilder,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { finalize } from 'rxjs';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// services
import { ApiService } from '../../services';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { mismatch: true };
}

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  public stage: 'email' | 'token' | 'password' | 'success' = 'email';

  public email: string = '';
  public token: string = '';

  public emailForm: FormGroup;
  public tokenForm: FormGroup;
  public passwordForm: FormGroup;

  public loading = false;

  public emailSubmitted = false;
  public tokenSubmitted = false;
  public passwordSubmitted = false;

  public emailNotFound = false;
  public invalidToken = false;

  constructor(
    private fb: FormBuilder,
    private readonly apiService: ApiService,
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.tokenForm = this.fb.group({
      token: ['', [Validators.required]],
    });

    this.passwordForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator },
    );

    this.emailForm.get('email')?.valueChanges.subscribe(() => {
      this.emailNotFound = false;
    });

    this.tokenForm.get('token')?.valueChanges.subscribe(() => {
      this.invalidToken = false;
    });
  }

  submitEmail() {
    if (this.loading) return;
    this.emailSubmitted = true;

    if (this.emailForm.valid) {
      this.loading = true;
      this.email = this.emailForm.value.email;

      this.apiService
        .generateToken({ email: this.email })
        .pipe(
          finalize(() => {
            this.loading = false;
          }),
        )
        .subscribe({
          next: (res: any) => {
            if (res.ok) this.stage = 'token';
          },
          error: (err: any) => {
            if (err.status === 404) this.emailNotFound = true;
          },
        });
    }
  }

  submitToken() {
    if (this.loading) return;
    this.tokenSubmitted = true;

    if (this.tokenForm.valid) {
      this.loading = true;
      this.token = this.tokenForm.value.token;

      this.apiService
        .verifyToken({ email: this.email, token: this.token })
        .pipe(
          finalize(() => {
            this.loading = false;
          }),
        )
        .subscribe({
          next: (res: any) => {
            if (res.ok) this.stage = 'password';
          },
          error: (err: any) => {
            if (err.status === 401) this.invalidToken = true;
          },
        });
    }
  }

  submitPassword() {
    if (this.loading) return;
    this.passwordSubmitted = true;

    if (this.passwordForm.valid) {
      this.loading = true;

      this.apiService
        .resetPassword({
          email: this.email,
          token: this.token,
          password: this.passwordForm.value.password,
        })
        .pipe(
          finalize(() => {
            this.loading = false;
          }),
        )
        .subscribe({
          next: (res: any) => {
            if (res.ok) this.stage = 'success';
          },
          error: () => {},
        });
    }
  }
}
