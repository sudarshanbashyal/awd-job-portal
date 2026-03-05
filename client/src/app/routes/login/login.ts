// packages
import { finalize } from 'rxjs';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// forms
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';

// services
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  public form: FormGroup;
  public submitted = false;
  public submissionSuccessful = false;
  public loading = false;
  public isIncorrectCredentials = false;

  constructor(
    private fb: FormBuilder,
    private readonly apiService: ApiService,
  ) {
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
    if (this.loading || this.submissionSuccessful) return;

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
              console.log(res);
            }
          },
          error: (err) => {
            if (err.status === 404) this.isIncorrectCredentials = true;
          },
        });
    }
  }
}
