// packages
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Component, effect, inject } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// services
import { ApiService, AuthService } from '../../services';

// components
import { Tag } from '../../components/tag/tag';
import { IconsModule } from '../../components/icons/icons-module';
import { AssessmentModal } from '../../components/assessment-modal/assessment-modal';

@Component({
  selector: 'app-job-details',
  imports: [Tag, IconsModule, CommonModule, RouterModule, AssessmentModal],
  templateUrl: './job-details.html',
  styleUrl: './job-details.scss',
})
export class JobDetails {
  loading = true;
  user: UserProfile | null = null;
  job: JobResultEntry | null = null;
  jobApplicationId: string = '';

  toastr = inject(ToastrService);
  private activatedRoute = inject(ActivatedRoute);

  public jobId = '';
  formattedDate = '';

  assessmentResult = null;
  isPopupOpen = false;

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

    // activated route
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.jobId = id;
        this.getJob();
        this.getJobApplication();
      }
    });
  }

  analyzeApplication() {
    this.isPopupOpen = true;
  }

  closeModal() {
    this.isPopupOpen = false;
  }

  changeApplicationStatus() {
    if (this.jobApplicationId) this.withdraw();
    else this.apply();
  }

  apply() {
    this.apiService
      .createApplication(this.jobId)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: (res) => {
          if (res.ok) {
            this.toastr.success('Your application has been made', 'Applied!', {
              progressBar: false,
              positionClass: 'toast-top-center',
            });
            this.getJobApplication();
          }
        },
        error: () => { },
      });
  }

  withdraw() {
    this.apiService
      .withdrawApplication(this.jobId)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: (res) => {
          if (res.ok) {
            if (res.ok) {
              this.toastr.success('Your application has been withdrawn', 'Application removed', {
                progressBar: false,
                positionClass: 'toast-top-center',
              });
              this.getJobApplication();
            }
          }
        },
        error: () => { },
      });
  }

  getJobApplication() {
    if (!this.jobId) return;

    this.apiService
      .getJobApplicationByJobId(this.jobId)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: (res) => {
          if (res.ok) {
            this.jobApplicationId = res.data.id;
          }
        },
        error: () => {
          this.jobApplicationId = '';
        },
      });
  }

  getJob() {
    if (!this.jobId) return;

    this.apiService
      .getJobById(this.jobId)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: (res) => {
          if (res.ok) {
            this.job = res.data;
            this.formattedDate = formatDate(res.data.createdAt, 'dd MMM, yyyy', 'en-US');
          }
        },
        error: () => { },
      });
  }
}
