// packages
import { Router } from "express";

// controllers
import * as Controller from "../controllers";

// libs
import { isApplicant, isRecruiter } from "../lib";

export const jobPostingRouter = Router();

// applicant functionalities
jobPostingRouter.get("/search", isApplicant, Controller.search);
jobPostingRouter.get("/job/:id", isApplicant, Controller.findJobById);

// recruiter functionalities
jobPostingRouter.get(
  "/job-posting/:id",
  isRecruiter,
  Controller.findJobPostingById,
);
jobPostingRouter.post("/create-job", isRecruiter, Controller.createJob);
jobPostingRouter.get("/my-jobs", isRecruiter, Controller.getJobPostings);
jobPostingRouter.patch("/update-job/:id", isRecruiter, Controller.updateJob);
jobPostingRouter.delete("/delete-job/:id", isRecruiter, Controller.deleteJob);
