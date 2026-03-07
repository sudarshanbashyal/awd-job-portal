type JobPostingsWithApplicationsCount = JobPosting & { _count: { jobApplications: number } };
type JobResultEntry = JobPosting & { postedBy: Recruiter };

interface BaseApiResponse {
  ok: boolean;
  errors: string[];
  data: unknown;
}

interface LoginResponse extends BaseApiResponse {
  data: {
    accessToken: string;
  };
}

interface RegisterResponse extends BaseApiResponse {
  data: {
    id: string;
  };
}

interface ProfileResponse extends BaseApiResponse {
  data: {
    id: string;
    email: string;
    profilePicture?: string;
    role: UserType;
    applicant?: Applicant;
    recruiter?: Recruiter;
  };
}

interface JobPostingsResponse extends BaseApiResponse {
  data: JobPostingsWithApplicationsCount[];
}

interface CreateJobResponse extends BaseApiResponse {
  data: {
    id: string;
  };
}

interface GetJobPostingResponse extends BaseApiResponse {
  data: JobPosting;
}

interface SearchJobResponse extends BaseApiResponse {
  data: JobResultEntry[];
}

interface JobByIdResponse extends BaseApiResponse {
  data: JobResultEntry;
}

interface JobApplicationByJobIdResponse extends BaseApiResponse {
  data: {
    id: string;
    applicationStatus: string;
  };
}

interface AssessmentStreamResponse {
  done: boolean;
  progress: number;
  assessment?: AssessmentReport;
}
