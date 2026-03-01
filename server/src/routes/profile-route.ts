// packages
import { Router } from "express";

// controllers
import * as Controller from "../controllers";

// libs
import { isApplicant, isRecruiter } from "../lib";

export const profileRouter = Router();

// applicant functionalities
profileRouter.patch(
  "/applicant-profile",
  isApplicant,
  Controller.updateApplicantProfile,
);
profileRouter.put("/skills", isApplicant, Controller.addOrUpdateSkills);
profileRouter.put("/education", isApplicant, Controller.addOrUpdateEducation);
profileRouter.post("/generate-resume", isApplicant, Controller.generateResume);
profileRouter.put("/experience", isApplicant, Controller.addOrUpdateExperience);

// recruiter functionalities
profileRouter.patch(
  "/recruiter-profile",
  isRecruiter,
  Controller.updateRecruiterProfile,
);
