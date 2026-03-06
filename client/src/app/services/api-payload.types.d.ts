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
