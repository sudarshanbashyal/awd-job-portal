// packages
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private eventSource?: EventSource;

  constructor(
    private zone: NgZone,
    private http: HttpClient,
  ) { }

  // auth services
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials);
  }

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${environment.apiUrl}/auth/register`, payload);
  }

  // profile services
  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${environment.apiUrl}/profile`);
  }

  updateApplicantProfile(
    payload: UpdateApplicantProfileRequest,
  ): Observable<UpdateProfileResponse> {
    return this.http.patch<UpdateProfileResponse>(
      `${environment.apiUrl}/applicant-profile`,
      payload,
    );
  }

  updateRecruiterProfile(
    payload: UpdateRecruiterProfileRequest,
  ): Observable<UpdateProfileResponse> {
    return this.http.patch<UpdateProfileResponse>(
      `${environment.apiUrl}/recruiter-profile`,
      payload,
    );
  }

  deleteAccount(): Observable<DeleteAccountResponse> {
    return this.http.delete<DeleteAccountResponse>(`${environment.apiUrl}/account`);
  }

  addOrUpdateExperience(payload: ProfessionalExperience): Observable<UpdateApplicantCredentials> {
    return this.http.put<UpdateApplicantCredentials>(`${environment.apiUrl}/experience`, {
      experiences: [payload],
    });
  }

  deleteExperience(id: string): Observable<UpdateApplicantCredentials> {
    return this.http.delete<UpdateApplicantCredentials>(
      `${environment.apiUrl}/experience/${id}`,
      {},
    );
  }

  // job posting services
  getJobPostings(params: GetJobPostingsRequest): Observable<JobPostingsResponse> {
    return this.http.get<JobPostingsResponse>(`${environment.apiUrl}/my-jobs`, {
      params: { search: params.search, status: params.status },
    });
  }

  createJob(payload: CreateJobRequest): Observable<CreateJobResponse> {
    return this.http.post<RegisterResponse>(`${environment.apiUrl}/create-job`, payload);
  }

  getJobPosting(id: string): Observable<GetJobPostingResponse> {
    return this.http.get<GetJobPostingResponse>(`${environment.apiUrl}/job-posting/${id}`);
  }

  updateJob(id: string, payload: CreateJobRequest): Observable<CreateJobResponse> {
    return this.http.patch<RegisterResponse>(`${environment.apiUrl}/update-job/${id}`, payload);
  }

  // job search/apply services
  searchJob(params: SearchJobRequest): Observable<SearchJobResponse> {
    return this.http.get<SearchJobResponse>(`${environment.apiUrl}/search`, {
      params: {
        search: params.search,
        workType: params.workType,
        location: params.location,
        arrangement: params.arrangement,
        salaryFrom: params.salaryFrom || '',
        salaryTo: params.salaryTo || '',
      },
    });
  }

  getJobById(id: string): Observable<JobByIdResponse> {
    return this.http.get<JobByIdResponse>(`${environment.apiUrl}/job/${id}`);
  }

  getJobApplicationByJobId(jobId: string): Observable<JobApplicationByJobIdResponse> {
    return this.http.get<JobApplicationByJobIdResponse>(
      `${environment.apiUrl}/my-application/${jobId}`,
    );
  }

  // job application and assessment services
  createApplication(jobId: string): Observable<JobApplicationByJobIdResponse> {
    return this.http.post<JobApplicationByJobIdResponse>(
      `${environment.apiUrl}/apply/${jobId}`,
      {},
    );
  }

  withdrawApplication(jobId: string): Observable<JobApplicationByJobIdResponse> {
    return this.http.patch<JobApplicationByJobIdResponse>(
      `${environment.apiUrl}/withdraw/${jobId}`,
      {},
    );
  }

  // SSE stream for AI resume assessment
  streamApplicationAssessment(jobId: string, token: string): Observable<AssessmentStreamResponse> {
    return new Observable((observer) => {
      this.eventSource = new EventSource(`${environment.apiUrl}/assess/${jobId}?token=${token}`);

      this.eventSource.onmessage = (event) => {
        this.zone.run(() => {
          observer.next(JSON.parse(event.data));
        });
      };

      this.eventSource.onerror = (error) => {
        this.zone.run(() => {
          observer.error(error);
        });
      };

      return () => this?.eventSource?.close();
    });
  }

  disconnectAssessmentStream() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = undefined;
    }
  }
}
