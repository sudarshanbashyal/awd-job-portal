// packages
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { Component, effect } from '@angular/core';

// services
import { ApiService, AuthService } from '../../services';

// components
import { JobEntry } from '../../components/job-entry/job-entry';
import { IconsModule } from '../../components/icons/icons-module';
import { JobFilter } from '../../components/job-filter/job-filter';

@Component({
  selector: 'app-job-search',
  imports: [JobEntry, JobFilter, IconsModule],
  templateUrl: './job-search.html',
  styleUrl: './job-search.scss',
})
export class JobSearch {
  loading = false;
  user: UserProfile | null = null;
  jobs: JobResultEntry[] = [];

  defaultParams = {
    search: '',
    workType: '',
    location: '',
    arrangement: '',
    salaryFrom: '',
    salaryTo: '',
  };

  constructor(
    private readonly router: Router,
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
  ) {
    // redirect user to login if not logged in
    effect(() => {
      const token = this.authService.getUserToken();
      if (!token) router.navigate(['/login']);

      const user = this.authService.getUser();
      if (user && user.role !== 'APPLICANT') router.navigate(['/job-postings']);
      this.user = user;
    });

    this.getJobs(this.defaultParams);
  }

  searchJobs(event: SearchJobRequest) {
    this.getJobs(event);
  }

  getJobs(params: SearchJobRequest) {
    this.loading = true;

    this.apiService
      .searchJob(params)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: (res) => {
          if (res.ok) {
            this.jobs = res.data;
          }
        },
        error: () => {},
      });
  }
}
