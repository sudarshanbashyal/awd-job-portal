// packages
import { RequestHandler, Response } from "express";

// libraries
import { AuthRequest, prisma } from "../lib";
import { JobApplicationStatus, JobStatus } from "../../generated/prisma/enums";
import { Prisma } from "generated/prisma/browser";

// types
interface ApplicantsQuery {
  search?: string;
  status?: JobApplicationStatus;
}

interface UpdateApplicationStatusDto {
  status: JobApplicationStatus;
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

    if (!applicant?.resumeLink) {
      res.status(401).json({
        ok: false,
        errors: ["Cannot apply without a resume."],
      });
      return;
    }

    // TODO: check if resume actually exists in the vault

    const newApplication = await prisma.jobApplication.create({
      data: {
        resumeLink: applicant.resumeLink,
        applicantId: applicantId as string,
        jobId: jobId,
      },
    });

    //TODO: initiaite AI resume parsing

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

    if (jobPosting?.recruiterId !== recruiterId) {
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

    const updatedApplication = await prisma.jobApplication.update({
      where: {
        id: applicationId,
      },
      data: {
        applicationStatus: updateApplicationDto.status,
      },
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
