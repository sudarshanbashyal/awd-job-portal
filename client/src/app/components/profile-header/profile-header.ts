// packages
import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';

// services
import { AuthService } from '../../services';

// components
import { ProfilePicture } from '../profile-picture/profile-picture';
import { ApplicantProfileForm } from '../applicant-profile-form/applicant-profile-form';
import { RecruiterProfileForm } from '../recruiter-profile-form/recruiter-profile-form';

@Component({
  selector: 'app-profile-header',
  imports: [CommonModule, ProfilePicture, ApplicantProfileForm, RecruiterProfileForm],
  templateUrl: './profile-header.html',
  styleUrl: './profile-header.scss',
})
export class ProfileHeader {
  profile: UserProfile | null = null;

  constructor(private authService: AuthService) {
    effect(() => {
      const user = this.authService.getUser();
      this.profile = user;
    });
  }
}
