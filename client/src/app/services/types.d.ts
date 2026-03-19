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

enum ParsedResumeStatus {
  PARSING = 'PARSING',
  PARSED = 'PARSED',
  FAILED = 'FAILED',
}

enum SkillType {
  HARD_SKILL = 'HARD_SKILL',
  SOFT_SKILL = 'SOFT_SKILL',
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

interface JobApplication {
  id: string;
  status: string;
  createdAt: Date;
  jobId: string;
  jobPosting: JobPosting & { postedBy: Recruiter };
}

interface JobApplicant {
  id: string;
  jobId: string;
  applicantId: string;
  applicationStatus: string;
  resumeLink: string;
  createdAt: Date;
  updatedAt: Date;
  applicant: Applicant & {
    user: {
      email: string;
      id: string;
    };
  };
  parsedResume: ParsedResume | null;
}

interface ParsedResume {
  id: string;
  status: ParsedResumeStatus;
  yearsOfExperience: number;
  rating: number;
  applicantId: string;
  createdAt: Date;
  updatedAt: Date;
  extractedSkills: ExtractedSkill[];
}

interface ExtractedSkill {
  id: string;
  skill: string;
  skillType: SkillType;
  parsedResumeId: string;
}

interface ApplicantStatusOption {
  value: string;
  text: string;
}

interface ApplicantJobApplication {
  id: string;
  applicationStatus: string;
}
