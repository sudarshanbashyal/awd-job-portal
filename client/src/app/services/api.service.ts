// packages
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) { }

  // auth services
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials);
  }

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${environment.apiUrl}/auth/register`, payload);
  }

  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${environment.apiUrl}/profile`);
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

  createApplication(jobId: string): Observable<JobApplicationByJobIdResponse> {
    return this.http.post<JobApplicationByJobIdResponse>(
      `${environment.apiUrl}/apply/${jobId}`,
      {},
    );
  }

  withDrawApplication(jobId: string): Observable<JobApplicationByJobIdResponse> {
    return this.http.patch<JobApplicationByJobIdResponse>(
      `${environment.apiUrl}/withdraw/${jobId}`,
      {},
    );
  }
}
