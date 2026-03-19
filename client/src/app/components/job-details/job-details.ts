// packages
import { finalize } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe, formatDate, Location } from '@angular/common';

// components
import { Tag } from '../tag/tag';
import { IconsModule } from '../icons/icons-module';

// services
import { ApiService } from '../../services';

@Component({
  selector: 'app-job-details',
  imports: [IconsModule, Tag, DatePipe],
  templateUrl: './job-details.html',
  styleUrl: './job-details.scss',
})
export class JobDetails {
  loading = true; 
  formattedDate = '';
  job: JobPosting | null = null;

  public jobId = '';
  private activatedRoute = inject(ActivatedRoute);

  constructor(
    private readonly location: Location,
    private readonly apiService: ApiService,
  ){
   // activated route
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.jobId = id;
        this.getJob();
      }
    });
  }

 getJob() {
    if (!this.jobId) return;

    this.apiService
      .getJobPosting(this.jobId)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: (res) => {
          if (res.ok) {
            this.job = res.data;
          }
        },
        error: () => {},
      });
  }

  goBack() {
    this.location.back();
  }
}
