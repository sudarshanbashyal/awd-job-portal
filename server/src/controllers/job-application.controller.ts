// packages
import { RequestHandler, Response } from "express";
import contentDisposition from "content-disposition";

// libraries
import {
  prisma,
  checkFile,
  AuthRequest,
  assessApplication,
  parseResumeDetails,
  sendStatusUpdatedEmail,
  extractPayloadFromToken,
  sendApplicationReceivedEmail,
} from "../lib";

// prisma
import {
  JobStatus,
  UploadType,
  JobApplicationStatus,
} from "../../generated/prisma/enums";
import { Prisma } from "generated/prisma/browser";

// types
interface ApplicantsQuery {
  search?: string;
  status?: JobApplicationStatus;
}

interface UpdateApplicationStatusDto {
  status: JobApplicationStatus;
  note?: string;
}

export const createNewApplication: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const applicantId = req.user?.applicantId;
    const jobId = req.params.id;

    const job = await prisma.jobPosting.findFirst({
      where: {
        AND: [
          {
            id: jobId,
          },
          {
            deletedAt: null,
          },
          {
            status: JobStatus.OPEN,
          },
        ],
      },
    });

    if (!job) {
      res.status(401).json({
        ok: false,
        errors: ["Job doesn't exist."],
      });
      return;
    }

    /*
     * Check if user has already applied for this job before.
     * As part of the business login, we will assume the following things:
     * 1. A user can only apply for one job application once
     * 2. However, a user can withdraw from the job application
     * 3. After withdrawing, the user can apply for the same job again.
     */
    const jobApplication = await prisma.jobApplication.findFirst({
      where: {
        AND: [
          {
            applicantId,
          },
          {
            jobId,
          },
          {
            applicationStatus: {
              not: JobApplicationStatus.WITHDRAWN,
            },
          },
        ],
      },
    });
    if (jobApplication) {
      res.status(401).json({
        ok: false,
        errors: ["You can only apply for a job once."],
      });
      return;
    }

    // fetch latest resume from user
    const applicant = await prisma.applicant.findFirst({
      where: {
        id: applicantId,
      },
    });
    const user = await prisma.user.findFirst({
      where: {
        id: applicant?.userId,
      },
    });

    if (!user) {
      res.status(404).json({
        ok: false,
        errors: ["User not found."],
      });
      return;
    }

    if (!applicant?.resumeLink) {
      res.status(401).json({
        ok: false,
        errors: ["Cannot apply without a resume."],
      });
      return;
    }

    // check if resume actually exists in the registry
    const filePath = checkFile(UploadType.RESUME, applicant.resumeLink);
    if (!filePath) {
      res.status(401).json({
        ok: false,
        errors: ["Failed to retrieve resume."],
      });
      return;
    }

    const newApplication = await prisma.jobApplication.create({
      data: {
        resumeLink: applicant.resumeLink,
        applicantId: applicantId as string,
        jobId: jobId,
      },
    });

    // send application received email
    sendApplicationReceivedEmail(user.email, {
      firstName: applicant.firstName,
      jobTitle: job.title,
    });

    // initiaite AI resume parsing
    parseResumeDetails(
      newApplication.id,
      newApplication.resumeLink,
      job.description,
    );

    res.status(201).json({
      ok: true,
      data: newApplication,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const withdrawApplication: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const applicantId = req.user?.applicantId;
    const jobId = req.params.id;

    const jobApplication = await prisma.jobApplication.findFirst({
      where: {
        AND: [
          {
            applicantId,
          },
          {
            jobId,
          },
          {
            applicationStatus: {
              not: JobApplicationStatus.WITHDRAWN,
            },
          },
        ],
      },
    });

    if (!jobApplication) {
      res.status(404).json({
        ok: false,
        errors: ["Job Application not found."],
      });
      return;
    }

    // Do not let users withdraw after they are rejected
    if (jobApplication.applicationStatus === JobApplicationStatus.REJECTED) {
      res.status(401).json({
        ok: false,
        errors: ["Cannot withdraw after rejection."],
      });
      return;
    }

    await prisma.jobApplication.update({
      where: {
        id: jobApplication.id,
      },
      data: {
        applicationStatus: JobApplicationStatus.WITHDRAWN,
      },
    });

    res.json({
      ok: true,
      data: {
        id: jobApplication.id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const getApplicantsByJobId: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const jobId = req.params.jobId;
    const recruiterId = req?.user?.recruiterId;
    const applicantQuery: ApplicantsQuery = req.query;

    const jobPosting = await prisma.jobPosting.findFirst({
      where: {
        id: jobId,
      },
    });

    if (jobPosting?.recruiterId !== recruiterId) {
      res.status(401).json({
        ok: false,
        errors: ["Unauthorized access."],
      });
      return;
    }

    const whereConditions: Prisma.JobApplicationWhereInput = {
      jobId,
    };
    if (applicantQuery.status?.trim()) {
      whereConditions.applicationStatus = applicantQuery.status;
    }
    if (applicantQuery.search?.trim()) {
      const terms = applicantQuery.search.trim().split(" ");

      whereConditions.applicant = {
        AND: terms.map((term) => ({
          OR: [
            { firstName: { contains: term } },
            { lastName: { contains: term } },
          ],
        })),
      };
    }

    const applicants = await prisma.jobApplication.findMany({
      where: whereConditions,
      include: {
        applicant: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });

    res.json({
      ok: true,
      data: applicants,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const updateApplicationStatus: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const jobId = req.params.jobId;
    const applicationId = req.params.applicationId;
    const updateApplicationDto: UpdateApplicationStatusDto = req.body;

    const recruiterId = req?.user?.recruiterId;

    const jobPosting = await prisma.jobPosting.findFirst({
      where: {
        id: jobId,
      },
    });

    if (!jobPosting || jobPosting?.recruiterId !== recruiterId) {
      res.status(401).json({
        ok: false,
        errors: ["Unauthorized access."],
      });
      return;
    }

    // do not allow updating if application is withdrawn
    const application = await prisma.jobApplication.findFirst({
      where: {
        id: applicationId,
      },
    });
    if (application?.applicationStatus === JobApplicationStatus.WITHDRAWN) {
      res.status(401).json({
        ok: false,
        errors: ["Cannot move withdrawn applicants"],
      });
      return;
    }

    const applicant = await prisma.applicant.findFirst({
      where: {
        id: application?.applicantId,
      },
    });
    const user = await prisma.user.findFirst({
      where: {
        id: applicant?.userId,
      },
    });

    if (!applicant || !user) {
      res.status(404).json({
        ok: false,
        errors: ["User not found"],
      });
      return;
    }

    const updatedApplication = await prisma.jobApplication.update({
      where: {
        id: applicationId,
      },
      data: {
        applicationStatus: updateApplicationDto.status,
      },
    });

    // Send application status change email
    sendStatusUpdatedEmail(user.email, {
      firstName: applicant.firstName,
      jobTitle: jobPosting?.title,
      newStatus: updateApplicationDto.status,
      message: updateApplicationDto.note,
    });

    res.json({
      ok: true,
      data: updatedApplication,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const getApplicantResume: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const recruiterId = req.user?.recruiterId;

    const jobId = req.params.jobId;
    const applicationId = req.params.applicationId;

    const jobPosting = await prisma.jobPosting.findFirst({
      where: {
        id: jobId,
      },
    });

    if (jobPosting?.recruiterId !== recruiterId) {
      res.status(401).json({
        ok: false,
        errors: ["Unauthorized access."],
      });
      return;
    }

    const application = await prisma.jobApplication.findFirst({
      where: {
        id: applicationId,
      },
    });

    if (!application) {
      res.status(404).json({
        ok: false,
        errors: ["Application not found."],
      });
      return;
    }

    const uploadedFile = await prisma.uploadedFile.findFirst({
      where: {
        storedName: application.resumeLink,
      },
    });

    if (!uploadedFile) {
      res.status(404).json({
        ok: false,
        errors: ["Application resume not found."],
      });
      return;
    }

    const filePath = checkFile(UploadType.RESUME, application.resumeLink);

    if (!filePath) {
      res.status(204).json({
        ok: true,
      });
      return;
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      contentDisposition(uploadedFile.originalName),
    );
    res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const getApplicantApplications: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const applicantId = req.user?.applicantId;

    const jobApplications = await prisma.jobApplication.findMany({
      where: {
        applicantId,
      },
      include: {
        jobPosting: {
          include: {
            postedBy: true,
          },
        },
      },
    });

    res.json({
      ok: true,
      data: jobApplications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const performApplicationAssessment: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    // manually verifying JWT in case of assessment because of SSE
    const token = req.query?.token;
    req.headers.authorization = (token || "") as string;
    const payload = extractPayloadFromToken(req);

    if (!payload) {
      res.status(401).json({
        ok: false,
        errors: ["Missing or expired token."],
      });
    }

    const applicantId = payload?.applicantId;
    const jobId = req.params.jobId;

    const applicant = await prisma.applicant.findFirst({
      where: {
        id: applicantId,
      },
    });

    if (!applicant?.resumeLink || !applicantId) {
      res.status(404).json({
        ok: false,
        errors: ["Resume not found."],
      });
      return;
    }

    const job = await prisma.jobPosting.findFirst({
      where: {
        id: jobId,
      },
    });

    if (!job) {
      res.status(404).json({
        ok: false,
        errors: ["Job not found."],
      });
      return;
    }

    // set headers for sse
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    let progress = 0;

    const interval = setInterval(() => {
      const nextProgress = progress + Math.floor(Math.random() * 10) + 1;
      if (nextProgress <= 90) progress = nextProgress;

      res.write(
        `data: ${JSON.stringify({ done: false, progress: progress })}\n\n`,
      );
    }, 2000);

    req.on("close", () => {
      clearInterval(interval);
      res.end();
    });

    try {
      const assessmentResponse = await assessApplication(
        applicantId,
        jobId,
        applicant.resumeLink,
        job?.description,
      );

      clearInterval(interval);

      const parsedAssessment = JSON.parse(assessmentResponse.description);

      if (
        parsedAssessment?.rating === null ||
        parsedAssessment?.rating === undefined ||
        !parsedAssessment?.summary ||
        !parsedAssessment?.suggestedImprovements
      ) {
        res.write(
          `event: error\n` +
            `data: ${JSON.stringify({ message: "Skill Assessment Failed" })}\n\n`,
        );
        res.end();
        return;
      }

      res.write(
        `data: ${JSON.stringify({ done: true, progress: 100, assessment: parsedAssessment })}\n\n`,
      );

      res.end();
    } catch (e) {
      clearInterval(interval);
      res.write(
        `event: error\n` +
          `data: ${JSON.stringify({ message: "Server Error" })}\n\n`,
      );
      res.end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const findJobApplicationByJobId: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const jobId = req.params.jobId;
    const applicantId = req?.user?.applicantId;

    const job = await prisma.jobApplication.findFirst({
      where: {
        AND: [
          {
            jobId,
          },
          {
            applicantId,
          },
          {
            applicationStatus: {
              not: JobApplicationStatus.WITHDRAWN,
            },
          },
        ],
      },
    });

    if (!job) {
      res.status(404).json({
        ok: false,
        errors: ["Job doesn't exist."],
      });
      return;
    }

    res.json({
      ok: true,
      data: job,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};
