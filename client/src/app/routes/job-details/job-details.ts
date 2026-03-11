// packages
import { finalize } from 'rxjs';
import { Component, effect, inject } from '@angular/core';
import { CommonModule, formatDate, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// services
import { ApiService, AuthService, ToastService } from '../../services';

// components
import { Tag } from '../../components/tag/tag';
import { IconsModule } from '../../components/icons/icons-module';
import { ProfilePicture } from '../../components/profile-picture/profile-picture';
import { AssessmentModal } from '../../components/assessment-modal/assessment-modal';

@Component({
  selector: 'app-job-details',
  imports: [Tag, IconsModule, CommonModule, RouterModule, AssessmentModal, ProfilePicture],
  templateUrl: './job-details.html',
  styleUrl: './job-details.scss',
})
export class JobDetails {
  loading = true;
  user: UserProfile | null = null;
  job: JobResultEntry | null = null;
  jobApplicationId: string = '';

  private activatedRoute = inject(ActivatedRoute);

  public jobId = '';
  formattedDate = '';

  assessmentResult = null;
  isPopupOpen = false;

  constructor(
    private readonly router: Router,
    private readonly location: Location,
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
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
    if (!this.user?.applicant?.resumeLink) {
      this.toastService.show(
        'No Resume',
        'Please upload a resume from your profile before applying.',
        'warning',
      );
      return;
    }

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
            this.toastService.show('Applied!', 'Your application has been made');
            this.getJobApplication();
          }
        },
        error: () => {},
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
              this.toastService.show('Application removed', 'Your application has been withdrawn');
              this.getJobApplication();
            }
          }
        },
        error: () => {},
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
            console.log('job: ', res.data);
            this.formattedDate = formatDate(res.data.createdAt, 'dd MMM, yyyy', 'en-US');
          }
        },
        error: () => {},
      });
  }

  goBack() {
    this.location.back();
  }
}
