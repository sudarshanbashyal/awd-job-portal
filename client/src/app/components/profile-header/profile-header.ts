// packages
import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';

// services
import { ApiService, AuthService, ToastService } from '../../services';

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

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private readonly toastService: ToastService,
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
      this.toastService.show('Invalid file format', 'Only png and jpeg are allowed', 'error');
      return;
    }

    this.apiService.uploadProfilePicture(profileFile).subscribe({
      next: (res) => {
        if (res.ok) {
          this.authService.loadUser();
          this.toastService.show('Profile updated.', 'Your profile picture has been changed.');
        }
      },
    });
  }
}
