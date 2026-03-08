interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  companyAddress?: string;
}

interface GetJobPostingsRequest {
  search: string;
  status: string;
}

interface CreateJobRequest {
  title: string;
  summary: string;
  description: string;
  location: string;
  jobType: string;
  arrangement: string;
  salaryFrom?: number | null;
  salaryTo?: number | null;
  status?: string;
}

interface SearchJobRequest {
  search: string;
  workType: string;
  location: string;
  arrangement: string;
  salaryFrom: string;
  salaryTo: string;
}

interface UpdateApplicantProfileRequest {
  firstName: string;
  lastName: string;
  location: string | null;
  phoneNumber: string | null;
  profile: string | null;
}

interface UpdateRecruiterProfileRequest {
  firstName: string;
  lastName: string;
  companyName: string;
  companyAddress: string;
}
