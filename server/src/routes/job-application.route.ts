// packages
import { Router } from "express";

// controllers
import * as Controller from "../controllers";

// libs
import { isApplicant, isRecruiter } from "../lib";

export const jobApplicationRouter = Router();

// applicant functionalities
jobApplicationRouter.post(
  "/apply/:id",
  isApplicant,
  Controller.createNewApplication,
);
jobApplicationRouter.patch(
  "/withdraw/:id",
  isApplicant,
  Controller.withdrawApplication,
);

// recruiter functionalities
jobApplicationRouter.get(
  "/applicants/:jobId",
  isRecruiter,
  Controller.getApplicantsByJobId,
);
jobApplicationRouter.patch(
  "/application-status/:jobId/:applicationId",
  isRecruiter,
  Controller.updateApplicationStatus,
);
