// packages
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Component, effect } from '@angular/core';

// forms
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';

// services
import { ApiService, AuthService, ToastService } from '../../services';

// libs
import { passwordMatchValidator } from '../../lib';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  public form: FormGroup;
  public submitted = false;
  public submissionSuccessful = false;
  public loading = false;

  constructor(
    private fb: FormBuilder,
    private readonly router: Router,
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
  ) {
    // redirect user to main page if already logged in
    effect(() => {
      const user = this.authService.getUser();
      if (user) {
        router.navigate(user.role === 'APPLICANT' ? ['/search'] : ['/job-postings']);
      }
    });

    this.form = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        repeatPassword: ['', [Validators.required]],
        role: ['', [Validators.required]],
        companyName: ['', [Validators.required]],
        companyAddress: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator },
    );

    this.setConditionalValidators();
  }

  private setConditionalValidators() {
    this.form.get('role')?.valueChanges.subscribe((role) => {
      const companyName = this.form.get('companyName');
      const companyAddress = this.form.get('companyAddress');

      if (role === 'RECRUITER') {
        companyName?.setValidators([Validators.required]);
        companyAddress?.setValidators([Validators.required]);
      } else {
        companyName?.clearValidators();
        companyAddress?.clearValidators();
      }

      companyName?.updateValueAndValidity();
      companyAddress?.updateValueAndValidity();
    });
  }

  submit() {
    console.log(this.loading, this.submissionSuccessful);
    if (this.loading || this.submissionSuccessful) return;

    this.submissionSuccessful = false;
    this.submitted = true;

    if (this.form.valid) {
      this.loading = true;

      this.apiService
        .register(this.form.value)
        .pipe(
          finalize(() => {
            this.loading = false;
          }),
        )
        .subscribe({
          next: (res) => {
            if (res.ok) {
              this.submissionSuccessful = true;
              this.toastService.show('Account created', 'Redirecting you to login');
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 1000);
            }
          },
          error: (err) => {
            if (err.status === 400) {
              this.form.setErrors({ duplicateEmail: true });
            }
          },
        });
    }
  }
}
