// packages
import { finalize } from 'rxjs';
import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

// forms
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';

// services
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  public form: FormGroup;
  public loading = false;
  public submitted = false;
  public submissionSuccessful = false;
  public isIncorrectCredentials = false;

  constructor(
    private fb: FormBuilder,
    private readonly router: Router,
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
  ) {
    // redirect user to main page if already logged in
    effect(() => {
      const user = this.authService.getUser();
      if (user) {
        console.log('saved user: ', user.role);
        router.navigate(user.role === 'APPLICANT' ? ['/search'] : ['/job-postings']);
      }
    });

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    this.watchFormUpdate();
  }

  private watchFormUpdate() {
    this.form.get('password')?.valueChanges.subscribe((pw) => {
      this.isIncorrectCredentials = false;
    });
    this.form.get('email')?.valueChanges.subscribe((pw) => {
      this.isIncorrectCredentials = false;
    });
  }

  submit() {
    if (this.loading) return;

    this.submissionSuccessful = false;
    this.submitted = true;

    if (this.form.valid) {
      this.loading = true;

      this.apiService
        .login(this.form.value)
        .pipe(
          finalize(() => {
            this.loading = false;
          }),
        )
        .subscribe({
          next: (res) => {
            if (res.ok) {
              this.submissionSuccessful = true;
              this.isIncorrectCredentials = false;

              // save token to local storage
              this.authService.saveUserToken(res.data.accessToken);
            }
          },
          error: (err) => {
            if (err.status === 404) this.isIncorrectCredentials = true;
          },
        });
    }
  }
}
