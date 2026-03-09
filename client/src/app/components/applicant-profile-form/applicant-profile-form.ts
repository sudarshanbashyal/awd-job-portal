// packages
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// services
import { ApiService, AuthService } from '../../services';

// libs
import { phoneNumberValidator } from '../../lib';

@Component({
  selector: 'app-applicant-profile-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './applicant-profile-form.html',
  styleUrl: './applicant-profile-form.scss',
})
export class ApplicantProfileForm {
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
      this.profile?.applicant && this.form.patchValue(this.profile?.applicant);
    });

    this.form = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      profile: [''],
      location: [''],
      phoneNumber: ['', [phoneNumberValidator]],
    });
  }

  submit() {
    this.submitted = true;
    console.log('form err: ', this.form.get('phoneNumber')?.errors?.['invalidPhoneNumber']);
    if (this.form.valid) {
      this.apiService.updateApplicantProfile(this.form.value).subscribe({
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
