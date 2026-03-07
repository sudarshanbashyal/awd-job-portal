// packages
import { CommonModule, formatDate } from '@angular/common';
import { Component, Input } from '@angular/core';

// components
import { Tag } from '../tag/tag';
import { IconsModule } from '../icons/icons-module';

@Component({
  selector: 'app-job-entry',
  imports: [Tag, IconsModule, CommonModule],
  templateUrl: './job-entry.html',
  styleUrl: './job-entry.scss',
})
export class JobEntry {
  @Input() jobEntry: JobResultEntry | null = null;

  formattedDate = '';

  ngOnChanges() {
    if (this.jobEntry) {
      this.formattedDate = formatDate(this.jobEntry.createdAt, 'dd MMM, yyyy', 'en-US');
    }
  }
}
