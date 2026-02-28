// libraries
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// types
import { Applicant, Recruiter, User } from "generated/prisma/browser";

// types
import { TokenPayload } from "./middlewares";

interface UserWithRecruiterOrApplicant extends User {
  recruiter?: Recruiter | null;
  applicant?: Applicant | null;
}

export const encryptPassword = async (pw: string) => {
  try {
    return await bcrypt.hash(pw, 10);
  } catch (error) {
    throw error;
  }
};

export const comparePassword = async (pw: string, hash: string) => {
  try {
    return await bcrypt.compare(pw, hash);
  } catch (error) {
    throw error;
  }
};

export const generateAccessToken = (user: UserWithRecruiterOrApplicant) => {
  try {
    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    if (user.recruiter) payload.recruiterId = user.recruiter.id;
    if (user.applicant) payload.applicantId = user.applicant.id;

    return jwt.sign(payload, process.env.AUTH_KEY!, {
      algorithm: "HS256",
      expiresIn: "3h",
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
