// packages
import { Component, Input } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';

// components
import { Tag } from '../tag/tag';
import { IconsModule } from '../icons/icons-module';

@Component({
  selector: 'app-job-posting-card',
  imports: [Tag, CommonModule, IconsModule],
  templateUrl: './job-posting-card.html',
  styleUrl: './job-posting-card.scss',
})
export class JobPostingCard {
  @Input() jobPost: JobPostingsWithApplicationsCount | null = null;

  formattedDate = '';

  ngOnChanges() {
    if (this.jobPost) {
      this.formattedDate = formatDate(this.jobPost.createdAt, 'dd MMM, yyyy', 'en-US');
    }
  }
}
