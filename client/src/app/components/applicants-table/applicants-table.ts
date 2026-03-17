// packages
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// components
import { Tag } from '../tag/tag';
import { IconsModule } from '../icons/icons-module';
import { ChangeStatusModal } from '../change-status-modal/change-status-modal';

// services
import { ApiService } from '../../services';

@Component({
  selector: 'app-applicants-table',
  imports: [DatePipe, IconsModule, Tag, FormsModule, ChangeStatusModal, CommonModule],
  templateUrl: './applicants-table.html',
  styleUrl: './applicants-table.scss',
})
export class ApplicantsTable {
  public statuses: ApplicantStatusOption[] = [
    {
      value: 'APPLIED',
      text: 'Applied',
    },
    {
      value: 'SHORTLISTED',
      text: 'Shortlisted',
    },
    {
      value: 'INTERVIEW',
      text: 'Invited for Interview',
    },
    {
      value: 'ASSESSMENT',
      text: 'Assessment',
    },
    {
      value: 'REJECTED',
      text: 'Rejected',
    },
    {
      value: 'WITHDRAWN',
      text: 'Withdrawn',
    },
    {
      value: 'OFFERED',
      text: 'Offered',
    },
    {
      value: 'OFFER_ACCEPTED',
      text: 'Offer Accepted',
    },
    {
      value: 'OFFER_REJECTED',
      text: 'Offer Rejected',
    },
  ];
  public jobId = '';
  public applicants: JobApplicant[] = [];
  private activatedRoute = inject(ActivatedRoute);

  selectedApplication: JobApplicant | null = null;
  selectedValue: ApplicantStatusOption | null = null;
  modalOpen: boolean = false;

  constructor(private readonly apiService: ApiService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.jobId = id;
        this.fetchApplicants();
      }
    });
  }

  fetchApplicants() {
    this.apiService.fetchJobApplicants(this.jobId).subscribe({
      next: (res) => {
        if (res.data) this.applicants = res.data;
      },
    });
  }

  downloadResume(applicationId: string, applicant: Applicant) {
    this.apiService.downloadApplicantResume(this.jobId, applicationId).subscribe({
      next: (res: Blob) => {
        const blob = new Blob([res]);
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${applicant.firstName} ${applicant.lastName}.pdf`;
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Download failed', err);
      },
    });
  }

  changeStatus(event: Event, application: JobApplicant) {
    const element = event.currentTarget as HTMLInputElement;
    if (application.applicationStatus === element.value) return;

    this.selectedApplication = application;
    this.selectedValue = {
      text: this.statuses.find((status) => status.value === element.value)?.text || element.value,
      value: element.value,
    };
    this.modalOpen = true;
  }

  closeModal() {
    this.selectedApplication = null;
    this.selectedValue = null;
    this.modalOpen = false;
    this.fetchApplicants();
  }
}
