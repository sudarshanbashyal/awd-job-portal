// packages
import { finalize } from 'rxjs';
import { Component, effect } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

// services
import { ApiService, AuthService } from '../../services';

// components
import { JobPostingCard } from '../../components/job-posting-card/job-posting-card';

@Component({
  selector: 'app-job-postings',
  imports: [ReactiveFormsModule, RouterModule, JobPostingCard],
  templateUrl: './job-postings.html',
  styleUrl: './job-postings.scss',
})
export class JobPostings {
  public form: FormGroup;
  jobPostings: JobPostingsWithApplicationsCount[] = [];
  isLoading = true;
  user: UserProfile | null = null;

  constructor(
    private fb: FormBuilder,
    private readonly router: Router,
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
  ) {
    // redirect user to login if not logged in
    effect(() => {
      const token = this.authService.getUserToken();
      if (!token) router.navigate(['/login']);

      const user = this.authService.getUser();
      if (user && user.role !== 'RECRUITER') router.navigate(['/search']);
      this.user = user;
    });

    this.form = this.fb.group({
      search: [''],
      status: [''],
    });
  }

  ngOnInit() {
    this.search();
  }

  search() {
    const search = this.form.get('search')?.value || '';
    const status = this.form.get('status')?.value || '';

    this.apiService
      .getJobPostings({ search, status })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: (res) => {
          if (res.ok) this.jobPostings = res.data;
        },
        error: () => { },
      });
  }
}
