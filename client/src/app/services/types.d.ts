interface User {
  id: string;
}

interface AccessToken {
  accessToken: string;
}

enum UserType {
  APPLICANT = 'APPLICANT',
  RECRUITER = 'RECRUITER',
}

interface UserProfile {
  id: string;
  email: string;
  profilePicture?: string;
  role: UserType;
  applicant?: Applicant;
  recruiter?: Recruiter;
}

interface Applicant {
  id: string;
  firstName: string;
  lastName: string;
  profile?: string;
  location?: string;
  phoneNumber?: string;
  resumeLink?: string;
  userId: string;
  skills?: UserSkill[];
  education?: EducationProfile[];
  professionalExperience?: ProfessionalExperience[];
}

interface UserSkill {
  id?: string | null;
  skill: string;
  applicantId: string;
}

interface ProfessionalExperience {
  id?: string | null;
  role: string;
  companyName: string;
  location: string;
  startedAt: string;
  endedAt?: string | null;
  description: string;
  applicantId: string;
}

interface EducationProfile {
  id?: string | null;
  instituteName: string;
  course: string;
  location: string;
  description: string;
  startedAt: string;
  endedAt: string | null;
  applicantId: string;
}

interface Recruiter {
  id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  companyAddress: string;
  userId: string;
}

interface JobPosting {
  id: string;
  title: string;
  summary: string;
  description: string;
  salaryFrom?: number;
  salaryTo?: number | null;
  yearsOfExperience?: number;
  jobType: string;
  level?: string | null;
  location: string;
  arrangement: string;
  status: string;
  createdAt: string;
}

interface AssessmentReport {
  rating: number;
  summary: string;
  suggestedImprovements: string[];
}

interface ResumeInfo {
  originalName: string;
  size: number;
}
