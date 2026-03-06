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
  skills?: SKill[];
  education?: Education[];
  professionalExperience?: ProfessionalExperience[];
}

interface Skill {
  id: string;
  skill: string;
  applicantId: string;
}

interface ProfessionalExperience {
  id: string;
  role: string;
  companyName: string;
  location: string;
  startedAt: string;
  endedAt?: string | null;
  description: string;
  applicantId: string;
}

interface Education {
  id: string;
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
