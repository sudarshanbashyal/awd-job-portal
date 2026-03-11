// packages
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';

// services
import { AuthService, ToastService } from '../../services';

// components
import { ProfilePicture } from '../profile-picture/profile-picture';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, ProfilePicture],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  isAuth = false;
  user: UserProfile | null = null;

  applicantRoutes = [
    { link: '/search', name: 'Home' },
    { link: 'my-applications', name: 'My Applications' },
  ];

  recruiterRoutes = [
    { link: '/job-listings', name: 'Home' },
    { link: '/job-post', name: 'Add Job' },
  ];

  constructor(
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
  ) {
    effect(() => {
      const user = this.authService.getUser();
      this.isAuth = !!user;
      this.user = user;
    });
  }

  logout() {
    this.authService.logout();
    this.toastService.show('Logged out', 'You have been logged out of the session');
  }
}
