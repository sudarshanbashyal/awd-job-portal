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
jobApplicationRouter.get(
  "/assess/:jobId",
  isApplicant,
  Controller.assessmentApplication,
);
jobApplicationRouter.get(
  "/my-applications",
  isApplicant,
  Controller.getApplicantApplications,
);

// recruiter functionalities
jobApplicationRouter.get(
  "/:jobId/applicants",
  isRecruiter,
  Controller.getApplicantsByJobId,
);

jobApplicationRouter.get(
  "/resume/:jobId/:applicationId",
  isRecruiter,
  Controller.getApplicantResume,
);
jobApplicationRouter.patch(
  "/application-status/:jobId/:applicationId",
  isRecruiter,
  Controller.updateApplicationStatus,
);
