// packages
import { Router } from '@angular/router';
import { Component, effect } from '@angular/core';

// components
import { JobDetails } from '../../components/job-details/job-details';
import { ApplicantsTable } from '../../components/applicants-table/applicants-table';

// services
import { AuthService } from '../../services';

@Component({
  selector: 'app-job-applicants',
  imports: [JobDetails, ApplicantsTable],
  templateUrl: './job-applicants.html',
  styleUrl: './job-applicants.scss',
})
export class JobApplicants {
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {
    effect(() => {
      const token = this.authService.getUserToken();
      if (!token) router.navigate(['/login']);

      const user = this.authService.getUser();
      if (user && user.role !== 'RECRUITER') router.navigate(['/search']);
    });
  }
}
