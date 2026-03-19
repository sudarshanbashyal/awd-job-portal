type JobPostingsWithApplicationsCount = JobPosting & { _count: { jobApplications: number } };
type JobResultEntry = JobPosting & { postedBy: Recruiter & { user: UserProfile } };

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
  data: ApplicantJobApplication;
}

interface AssessmentStreamResponse {
  done: boolean;
  progress: number;
  assessment?: AssessmentReport;
}

interface ProfileResponse extends BaseApiResponse {
  data:
  | ({
    id: string;
    email: string;
    profilePicture: string | null;
  } & {
    applicant: Applicant;
  })
  | { recruiter: Recruiter };
}

interface UpdateProfileResponse extends BaseApiResponse {
  data: {
    id: string;
  };
}

interface DeleteAccountResponse extends BaseApiResponse {
  data: {
    message: string;
  };
}

interface UpdateApplicantCredentials extends BaseApiResponse {
  data: {
    mesage: string;
  };
}

interface MessageResponse extends BaseApiResponse {
  data: {
    message: string;
  };
}

interface ResumeInfoResponse extends BaseApiResponse {
  data: ResumeInfo;
}

interface MyApplicationsResponse extends BaseApiResponse {
  data: JobApplication[];
}

interface JobApplicantsResposne extends BaseApiResponse {
  data: JobApplicant[];
}

interface UpdateApplicationStatusResponse extends BaseApiResponse {
  data: {
    id: string;
  };
}
