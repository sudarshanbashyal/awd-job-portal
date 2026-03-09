// packages
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';

// services
import { ApiService, AuthService } from '../../services';

// components
import { ProfileResume } from '../profile-resume/profile-resume';
import { ProfilePicture } from '../profile-picture/profile-picture';
import { ApplicantProfileForm } from '../applicant-profile-form/applicant-profile-form';
import { RecruiterProfileForm } from '../recruiter-profile-form/recruiter-profile-form';

@Component({
  selector: 'app-profile-header',
  imports: [
    CommonModule,
    ProfileResume,
    ProfilePicture,
    ApplicantProfileForm,
    RecruiterProfileForm,
  ],
  templateUrl: './profile-header.html',
  styleUrl: './profile-header.scss',
})
export class ProfileHeader {
  profile: UserProfile | null = null;

  toastr = inject(ToastrService);

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
  ) {
    effect(() => {
      const user = this.authService.getUser();
      this.profile = user;
    });
  }

  uploadProfile(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;

    if (fileList?.length !== 1) return;

    const [profileFile] = fileList;
    if (profileFile.type !== 'image/jpeg' && profileFile.type !== 'image/png') {
      this.toastr.error('Only png and jpeg are allowed', 'Invalid file format', {
        progressBar: false,
        positionClass: 'toast-top-center',
      });
      return;
    }

    this.apiService.uploadProfilePicture(profileFile).subscribe({
      next: (res) => {
        if (res.ok) {
          console.log('profile picture: ', res);
          this.authService.loadUser();
          this.toastr.success('Your profile picture has been changed.', 'Profile updated.', {
            progressBar: false,
            positionClass: 'toast-top-center',
          });
        }
      },
    });
  }
}
