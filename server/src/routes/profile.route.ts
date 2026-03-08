// packages
import { Router } from "express";

// controllers
import * as Controller from "../controllers";

// libs
import { isApplicant, isAuth, isRecruiter, memoryUpload, upload } from "../lib";

export const profileRouter = Router();

// applicant functionalities
profileRouter.post(
  "/resume",
  isApplicant,
  upload.single("file"),
  Controller.uploadResume,
);
profileRouter.get(
  "/resume",
  isApplicant,
  upload.single("file"),
  Controller.getResume,
);
profileRouter.patch(
  "/applicant-profile",
  isApplicant,
  Controller.updateApplicantProfile,
);
profileRouter.put("/skills", isApplicant, Controller.addOrUpdateSkills);
profileRouter.put("/education", isApplicant, Controller.addOrUpdateEducation);
profileRouter.post("/generate-resume", isApplicant, Controller.generateResume);
profileRouter.put("/experience", isApplicant, Controller.addOrUpdateExperience);

profileRouter.delete(
  "/experience/:id",
  isApplicant,
  Controller.deleteExperience,
);
profileRouter.delete("/skill/:id", isApplicant, Controller.deleteSkill);
profileRouter.delete("/education/:id", isApplicant, Controller.deleteEducation);

// recruiter functionalities
profileRouter.patch(
  "/recruiter-profile",
  isRecruiter,
  Controller.updateRecruiterProfile,
);

// applicant and recruiter functionalities
profileRouter.post(
  "/profile-picture",
  isAuth,
  memoryUpload.single("file"),
  Controller.uploadProfilePicture,
);
profileRouter.get("/profile", isAuth, Controller.getprofile);
profileRouter.delete("/account", isAuth, Controller.deleteAccount);
profileRouter.get("/profile-picture", isAuth, Controller.getProfilePicture);
