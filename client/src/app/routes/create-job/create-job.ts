// packages
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// mdoule
import { IconsModule } from '../../components/icons/icons-module';

// services
import { ApiService, AuthService } from '../../services';

// libs
import { minWords, salaryRangeValidator } from '../../lib';

// components
import { Tag } from '../../components/tag/tag';

@Component({
  selector: 'app-create-job',
  imports: [ReactiveFormsModule, CommonModule, RouterModule, Tag, IconsModule, RouterModule],
  templateUrl: './create-job.html',
  styleUrl: './create-job.scss',
})
export class CreateJob {
  public form: FormGroup;
  public submitted = false;
  public submissionSuccessful = false;
  public loading = false;
  public loadingPrevJob = false;

  public jobId = '';
  public previousJob: JobPosting | null = null;

  toastr = inject(ToastrService);
  private activatedRoute = inject(ActivatedRoute);

  constructor(
    private fb: FormBuilder,
    private readonly router: Router,
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
  ) {
    effect(() => {
      const token = this.authService.getUserToken();
      if (!token) router.navigate(['/login']);

      const user = this.authService.getUser();
      if (user && user.role !== 'RECRUITER') router.navigate(['/search']);
    });

    // activated route
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.jobId = id;
        this.getJob();
      }
    });

    this.form = this.fb.group(
      {
        title: ['', [Validators.required]],
        summary: ['', [Validators.required, minWords(50)]],
        description: ['', [Validators.required, minWords(100)]],
        location: ['', [Validators.required]],
        jobType: ['', [Validators.required]],
        arrangement: ['', [Validators.required]],
        salaryFrom: [null, []],
        salaryTo: [null, []],
      },
      { validators: salaryRangeValidator },
    );
  }

  getJob() {
    if (!this.jobId) return;
    this.loadingPrevJob = true;
    this.apiService
      .getJobPosting(this.jobId)
      .pipe(
        finalize(() => {
          this.loadingPrevJob = false;
        }),
      )
      .subscribe({
        next: (res) => {
          if (res.ok) {
            this.previousJob = res.data;

            // set values from pervious job
            this.form.patchValue(res.data);
          }
        },
        error: () => {
          this.router.navigate(['/job-post']);
        },
      });
  }

  updateJobStatus() {
    if (!this.previousJob) return;

    this.loading = true;
    this.updateJob({
      ...this.previousJob,
      status: this.previousJob?.status === 'OPEN' ? 'CLOSED' : 'OPEN',
    });
  }

  updateJob(payload: CreateJobRequest) {
    if (!this.previousJob) return;
    this.apiService
      .updateJob(this.previousJob.id, payload)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: (res) => {
          if (res.ok) {
            this.submissionSuccessful = true;
            this.toastr.success('Your job has been updated', 'Job Updated', {
              progressBar: false,
              positionClass: 'toast-top-center',
            });
            this.getJob();
          }
        },
        error: () => { },
      });
  }

  submit() {
    if (this.loading || this.submissionSuccessful) return;

    this.submissionSuccessful = false;
    this.submitted = true;

    if (this.form.valid) {
      this.loading = true;
      this.submissionSuccessful = true;

      if (!this.previousJob) {
        this.apiService
          .createJob(this.form.value)
          .pipe(
            finalize(() => {
              this.loading = false;
            }),
          )
          .subscribe({
            next: (res) => {
              if (res.ok) {
                this.submissionSuccessful = true;
                this.toastr.success('A new job has been created!', 'Job Posted', {
                  progressBar: false,
                  positionClass: 'toast-top-center',
                });
                setTimeout(() => {
                  this.router.navigate(['/job-postings']);
                }, 1000);
              }
            },
            error: () => { },
          });
      } else {
        this.updateJob(this.form.value);
      }
    }
  }
}
