// packages
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// services
import { ApiService, AuthService } from '../../services';

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

  toastr = inject(ToastrService);

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
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
          this.toastr.success('Your profile has been successfully updated', 'Profile Updated', {
            progressBar: false,
            positionClass: 'toast-top-center',
          });
        },
        error: () => { },
      });
    }
  }
}
