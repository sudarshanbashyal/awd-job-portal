// packages
import { RequestHandler, Response } from "express";

// libraries
import { AuthRequest, prisma } from "../lib";

// prisma
import {
  JobType,
  JobStatus,
  JobArrangement,
} from "../../generated/prisma/enums";
import { Prisma } from "generated/prisma/browser";

// types
interface CreateJobDto {
  summary: string;
  title: string;
  description: string;
  salaryFrom?: number;
  salaryTo?: number;
  yearsOfExperience?: number;
  jobType: JobType;
  location: string;
  arrangement: JobArrangement;
  status?: JobStatus;
}

interface JobPostingQuery {
  search?: string;
  status?: JobStatus;
}

interface JobSearchQuery {
  search?: string;
  location?: string;
  salaryFrom?: string;
  salaryTo?: string;
  workArrangement?: JobArrangement;
  workType?: JobType;
}

export const createJob: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const createJobDto: CreateJobDto = req.body;
    const recruiterId = req?.user?.recruiterId;

    if (!recruiterId) {
      res.status(400).json({
        ok: false,
        errors: ["Recruiter id missing from token."],
      });
      return;
    }

    const newJob = await prisma.jobPosting.create({
      data: {
        ...createJobDto,
        recruiterId: recruiterId as string,
      },
    });

    if (!newJob) throw new Error();
    res.status(201).json({
      ok: true,
      data: newJob,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const updateJob: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const updateJobDto: CreateJobDto = req.body;
    const jobId = req.params.id;

    const job = await prisma.jobPosting.findFirst({
      where: {
        id: jobId,
      },
    });

    if (!job) {
      res.status(404).json({
        ok: false,
        errors: ["Job for id not found."],
      });
      return;
    }

    if (job?.recruiterId !== req.user?.recruiterId) {
      res.status(401).json({
        ok: false,
        errors: ["Unauthorized access."],
      });
      return;
    }

    const updatedJob = await prisma.jobPosting.update({
      where: {
        id: jobId,
      },
      data: updateJobDto,
    });

    res.status(201).json({
      ok: true,
      data: updatedJob,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const deleteJob: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const jobId = req.params.id;

    const job = await prisma.jobPosting.findFirst({
      where: {
        id: jobId,
      },
    });

    if (!job) {
      res.status(404).json({
        ok: false,
        errors: ["Job for id not found."],
      });
      return;
    }

    if (job?.recruiterId !== req.user?.recruiterId) {
      res.status(401).json({
        ok: false,
        errors: ["Unauthorized access."],
      });
      return;
    }

    await prisma.jobPosting.update({
      where: {
        id: jobId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    res.status(201).json({
      ok: true,
      message: "Job Deleted.",
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const getJobPostings: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const queryParam = req.query as JobPostingQuery;

    const recruiterId = req?.user?.recruiterId;

    if (!recruiterId) {
      res.status(400).json({
        ok: false,
        errors: ["Recruiter id missing from token."],
      });
      return;
    }

    const whereConditions: Prisma.JobPostingWhereInput = {
      recruiterId,
      deletedAt: null,
    };
    if (queryParam.search?.trim()) {
      whereConditions.title = {
        contains: queryParam.search,
      };
    }
    if (queryParam.status?.trim()) {
      whereConditions.status = queryParam.status;
    }

    const jobPostings = await prisma.jobPosting.findMany({
      where: whereConditions,
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      ok: true,
      data: jobPostings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const search: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const queryParam = req.query as JobSearchQuery;

    const whereConditions: Prisma.JobPostingWhereInput = {
      deletedAt: null,
      status: {
        notIn: [JobStatus.DRAFTED, JobStatus.CLOSED],
      },
    };
    if (queryParam.search?.trim()) {
      whereConditions.title = {
        contains: queryParam.search,
      };
    }
    if (queryParam.location?.trim()) {
      whereConditions.location = {
        contains: queryParam.location,
      };
    }
    if (queryParam.workArrangement?.trim()) {
      whereConditions.arrangement = queryParam.workArrangement;
    }
    if (queryParam.workType?.trim()) {
      whereConditions.jobType = queryParam.workType;
    }
    if (queryParam.salaryFrom?.trim()) {
      whereConditions.salaryFrom = {
        gte: +queryParam.salaryFrom,
      };
    }
    if (queryParam.salaryTo?.trim()) {
      whereConditions.salaryTo = {
        lte: +queryParam.salaryTo,
      };
    }

    const jobPostings = await prisma.jobPosting.findMany({
      where: whereConditions,
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      ok: true,
      data: jobPostings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const findJobById: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const id = req.params.id;

    const job = await prisma.jobPosting.findFirst({
      where: {
        AND: [
          {
            id,
          },
          {
            status: {
              in: [JobStatus.OPEN, JobStatus.CLOSED],
            },
          },
          {
            deletedAt: null,
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

export const findJobPostingById: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const id = req.params.id;
    const recruiterId = req?.user?.recruiterId;

    const job = await prisma.jobPosting.findFirst({
      where: {
        AND: [
          {
            recruiterId,
          },
          {
            id,
          },
          {
            deletedAt: null,
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
