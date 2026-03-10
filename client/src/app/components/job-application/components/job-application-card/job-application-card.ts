import { RouterModule } from '@angular/router';
import { Component, Input } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';

import { Tag } from '../../../tag/tag';

@Component({
  selector: 'app-job-application-card',
  imports: [Tag, CommonModule, RouterModule],
  templateUrl: './job-application-card.html',
  styleUrl: './job-application-card.scss',
})
export class JobApplicationCard {
  @Input() application: any = null;

  formattedDate = '';

  ngOnChanges() {
    if (this.application) {
      this.formattedDate = formatDate(this.application.createdAt, 'dd MMM, yyyy', 'en-US');
      console.log('Card application:', this.application);
    }
    
  }
}