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

type JobPostingsWithApplicationsCount = JobPosting & { _count: { jobApplications: number } };

interface JobPostingsResponse extends BaseApiResponse {
  data: JobPostingsWithApplicationsCount[];
}
