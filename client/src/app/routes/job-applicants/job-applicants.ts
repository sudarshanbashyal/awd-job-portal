import { Component } from '@angular/core';
import { JobDetails } from '../../components/job-details/job-details';
import { ApplicantsTable } from "../../components/applicants-table/applicants-table";

@Component({
  selector: 'app-job-applicants',
  imports: [JobDetails, ApplicantsTable],
  templateUrl: './job-applicants.html',
  styleUrl: './job-applicants.scss',
})
export class JobApplicants {

}
