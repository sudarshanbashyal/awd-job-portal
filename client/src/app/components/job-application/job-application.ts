import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JobApplicationCard } from './components/job-application-card/job-application-card';
import { ApiService } from '../../services';
@Component({
  selector: 'app-job-application',
  imports: [CommonModule, RouterModule, JobApplicationCard],
  templateUrl: './job-application.html',
  styleUrl: './job-application.scss',
})

export class JobApplication implements OnInit {
  applications: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getMyApplications().subscribe({
      next: (response) => {
        console.log('Applications:', response);
        this.applications = response.data ?? [];
        console.log('Assigned applications:', this.applications);
      },
      error: (error) => {
        console.error('Error fetching applications:', error);
      },
    });
  }
}