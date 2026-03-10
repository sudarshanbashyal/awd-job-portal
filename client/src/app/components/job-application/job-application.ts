// packages
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, effect, OnInit } from '@angular/core';

// components
import { JobApplicationCard } from './components/job-application-card/job-application-card';

// services
import { ApiService, AuthService } from '../../services';

@Component({
  selector: 'app-job-application',
  imports: [CommonModule, RouterModule, JobApplicationCard],
  templateUrl: './job-application.html',
  styleUrl: './job-application.scss',
})
export class JobApplication implements OnInit {
  applications: any[] = [];

  constructor(
    private apiService: ApiService,
    private readonly router: Router,
    private authService: AuthService,
  ) {
    // redirect user to login if not logged in
    effect(() => {
      const token = this.authService.getUserToken();
      if (!token) router.navigate(['/login']);

      const user = this.authService.getUser();
      if (user && user.role !== 'APPLICANT') router.navigate(['/job-postings']);
    });
  }

  ngOnInit() {
    this.apiService.getMyApplications().subscribe({
      next: (response) => {
        console.log('Applications:', response);
        this.applications = response.data ?? [];
        console.log('Assigned applications:', this.applications);
      },
      error: (error) => {
        console.error('Error fetching applications:', error);
      },
    });
  }
}
