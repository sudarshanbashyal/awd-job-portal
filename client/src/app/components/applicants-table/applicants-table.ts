// packages
import { ActivatedRoute } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

// components
import { Tag } from '../tag/tag';
import { NoData } from '../no-data/no-data';
import { IconsModule } from '../icons/icons-module';
import { ChangeStatusModal } from '../change-status-modal/change-status-modal';

// services
import { ApiService } from '../../services';

@Component({
  selector: 'app-applicants-table',
  imports: [
    Tag,
    NoData,
    DatePipe,
    IconsModule,
    FormsModule,
    CommonModule,
    ChangeStatusModal,
    ReactiveFormsModule,
  ],
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

  public form: FormGroup;

  selectedApplication: JobApplicant | null = null;
  selectedValue: ApplicantStatusOption | null = null;
  modalOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private readonly apiService: ApiService,
  ) {
    this.form = this.fb.group({
      search: [''],
      status: [''],
    });
  }

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
    this.apiService
      .fetchJobApplicants(this.jobId, {
        search: this.form.get('search')?.value || '',
        status: this.form.get('status')?.value || '',
      })
      .subscribe({
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
