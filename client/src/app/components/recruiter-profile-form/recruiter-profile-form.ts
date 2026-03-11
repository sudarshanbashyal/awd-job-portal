// packages
import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// services
import { ApiService, AuthService, ToastService } from '../../services';

@Component({
  selector: 'app-recruiter-profile-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './recruiter-profile-form.html',
  styleUrl: './recruiter-profile-form.scss',
})
export class RecruiterProfileForm {
  public form: FormGroup;
  submitted = false;

  profile: UserProfile | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private toastService: ToastService,
  ) {
    effect(() => {
      const user = this.authService.getUser();
      this.profile = user;
      this.profile?.recruiter && this.form.patchValue(this.profile?.recruiter);
    });

    this.form = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      companyAddress: ['', [Validators.required]],
    });
  }

  submit() {
    this.submitted = true;
    if (this.form.valid) {
      this.apiService.updateRecruiterProfile(this.form.value).subscribe({
        next: (res) => {
          if (res.ok) {
            this.authService.loadUser();
          }
          this.toastService.show('Profile Updated', 'Your profile has been successfully updated');
        },
        error: () => {},
      });
    }
  }
}
