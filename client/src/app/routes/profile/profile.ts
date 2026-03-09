// packages
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';

// services
import { AuthService } from '../../services';

// components
import { Skill } from '../../components/skill/skill';
import { Education } from '../../components/education/education';
import { Experience } from '../../components/experience/experience';
import { ProfileHeader } from '../../components/profile-header/profile-header';
import { DeleteAccount } from '../../components/delete-account/delete-account';

@Component({
  selector: 'app-profile',
  imports: [Skill, CommonModule, ProfileHeader, Experience, Education, DeleteAccount],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  userProfile: UserProfile | null = null;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {
    // redirect user to main page if already logged in
    effect(() => {
      const token = this.authService.getUserToken();
      const user = this.authService.getUser();
      this.userProfile = user;
      if (!token && !user) {
        router.navigate(['/login']);
      }
    });
  }

  refetchProfile() {
    this.authService.loadUser();
  }
}
