// packages
import { RequestHandler, Response } from "express";
import contentDisposition from "content-disposition";

// libraries
import {
  prisma,
  checkFile,
  AuthRequest,
  generateResumeFromProfile,
} from "../lib";

// prisma
import { UploadType } from "../../generated/prisma/enums";

// types
interface UpdateApplicantProfileDto {
  firstName: string;
  lastName: string;
  profile?: string;
  location?: string;
  phoneNumber?: string;
}

interface UpdateRecruiterProfileDto {
  firstName: string;
  lastName: string;
  companyName: string;
  companyAddress: string;
}

interface SkillDto {
  id?: string;
  skill: string;
  skillRating?: number;
}

interface ExperienceDto {
  id?: string;
  role: string;
  companyName: string;
  location: string;
  startedAt: Date;
  endedAt?: Date;
  description: string;
}

interface EducationDto {
  id?: string;
  instituteName: string;
  location: string;
  course: string;
  startedAt: Date;
  endedAt?: Date;
  description?: string;
}

export const updateApplicantProfile: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const applicantId = req.user?.applicantId;
    const updateDto: UpdateApplicantProfileDto = req.body;

    const updatedApplicant = await prisma.applicant.update({
      where: {
        id: applicantId,
      },
      data: updateDto,
    });

    res.json({
      ok: true,
      data: updatedApplicant,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const updateRecruiterProfile: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const recruiterId = req.user?.recruiterId;
    const updateDto: UpdateRecruiterProfileDto = req.body;

    const updatedRecruiter = await prisma.recruiter.update({
      where: {
        id: recruiterId,
      },
      data: updateDto,
    });

    res.json({
      ok: true,
      data: updatedRecruiter,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const addOrUpdateSkills: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const applicantId = req.user?.applicantId;
    const skillsDto: SkillDto[] = req.body.skills;

    await prisma.$transaction(
      skillsDto.map((item) => {
        if (item.id) {
          return prisma.skills.update({
            where: { id: item.id },
            data: item,
          });
        } else {
          return prisma.skills.create({
            data: {
              ...item,
              applicantId,
            },
          });
        }
      }),
    );

    res.status(201).json({
      ok: true,
      data: {
        msg: "Applicant skills updated.",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const addOrUpdateEducation: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const applicantId = req.user?.applicantId;
    const educationDto: EducationDto[] = req.body.educations;

    await prisma.$transaction(
      educationDto.map((item) => {
        if (item.id) {
          return prisma.education.update({
            where: { id: item.id },
            data: item,
          });
        } else {
          return prisma.education.create({
            data: {
              ...item,
              applicantId,
            },
          });
        }
      }),
    );

    res.status(201).json({
      ok: true,
      data: {
        msg: "Applicant education updated.",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const addOrUpdateExperience: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const applicantId = req.user?.applicantId;
    const experienceDto: ExperienceDto[] = req.body.experiences;

    await prisma.$transaction(
      experienceDto.map((item) => {
        if (item.id) {
          return prisma.professionalExperience.update({
            where: { id: item.id },
            data: item,
          });
        } else {
          return prisma.professionalExperience.create({
            data: {
              ...item,
              applicantId,
            },
          });
        }
      }),
    );

    res.status(201).json({
      ok: true,
      data: {
        msg: "Applicant experience updated.",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const generateResume: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const applicantId = req.user?.applicantId;

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

    if (!applicant || !user) {
      res.status(404).json({
        ok: false,
        errors: ["User/Applicant not found."],
      });
      return;
    }

    const skills = await prisma.skills.findMany({
      where: {
        applicantId,
      },
    });

    const educations = await prisma.education.findMany({
      where: {
        applicantId,
      },
    });

    const experiences = await prisma.professionalExperience.findMany({
      where: {
        applicantId,
      },
    });

    if (!skills.length || !educations.length) {
      res.status(401).json({
        ok: false,
        errors: ["Cannot generate resume without skills and educations."],
      });
      return;
    }

    const uploadedFile = await generateResumeFromProfile(
      applicant,
      user,
      skills,
      educations,
      experiences,
    );

    if (!uploadedFile) {
      res.status(500).json({
        ok: false,
        errors: ["Couldn't save resume"],
      });
      return;
    }

    await prisma.$transaction(async (_tx) => {
      await prisma.uploadedFile.create({
        data: {
          originalName: `Resume - ${applicant.firstName} ${applicant.lastName}.pdf`,
          storedName: uploadedFile.fileName,
          mimeType: "application/pdf",
          size: uploadedFile.fileSizeInBytes,
          uploadType: UploadType.RESUME,
          userId: user.id as string,
        },
      });

      await prisma.applicant.update({
        where: {
          id: applicantId as string,
        },
        data: {
          resumeLink: uploadedFile.fileName,
        },
      });
    });

    res.status(201).json({
      ok: true,
      data: {
        resumeName: uploadedFile.fileName,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const uploadProfilePicture: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  const userId = req.user?.id;
  const file = req.file;
  if (!file) {
    res.status(401).json({
      ok: false,
      errors: ["No file uploaded."],
    });
    return;
  }

  if (!file.mimetype.startsWith("image/")) {
    res.status(401).json({
      ok: false,
      errors: ["Invalid file format. Only images allowed."],
    });
    return;
  }

  await prisma.$transaction(async (_tx) => {
    await prisma.uploadedFile.create({
      data: {
        originalName: file.originalname,
        storedName: file.filename,
        mimeType: file.mimetype,
        size: file.size,
        uploadType: UploadType.PROFILE_PICTURE,
        userId: userId as string,
      },
    });

    await prisma.user.update({
      where: {
        id: userId as string,
      },
      data: {
        profilePicture: file.filename,
      },
    });
  });

  try {
    res.json({
      ok: true,
      data: {
        message: "Profile picture uploaded.",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const getProfilePicture: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.id;
    const user = await prisma.user.findFirst({
      where: {
        id: userId as string,
      },
    });
    if (!user) {
      res.status(404).json({
        ok: false,
        errors: ["User not found."],
      });
    }

    if (!user?.profilePicture) {
      res.status(204).json({
        ok: true,
      });
      return;
    }

    const file = await prisma.uploadedFile.findFirst({
      where: {
        storedName: user.profilePicture,
      },
    });

    const filePath = checkFile(UploadType.PROFILE_PICTURE, user.profilePicture);

    if (!file || !filePath) {
      res.status(204).json({
        ok: true,
      });
      return;
    }

    res.setHeader("Content-Type", file.mimeType ?? "application/octet-stream");
    res.setHeader("Content-Disposition", contentDisposition(file.originalName));
    res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const uploadResume: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.id;
    const applicantId = req.user?.applicantId;
    const file = req.file;
    if (!file) {
      res.status(401).json({
        ok: false,
        errors: ["No file uploaded."],
      });
      return;
    }

    if (file.mimetype !== "application/pdf") {
      res.status(401).json({
        ok: false,
        errors: ["Invalid file format. Only pdf allowed."],
      });
      return;
    }

    await prisma.$transaction(async (_tx) => {
      await prisma.uploadedFile.create({
        data: {
          originalName: file.originalname,
          storedName: file.filename,
          mimeType: file.mimetype,
          size: file.size,
          uploadType: UploadType.RESUME,
          userId: userId as string,
        },
      });

      await prisma.applicant.update({
        where: {
          id: applicantId as string,
        },
        data: {
          resumeLink: file.filename,
        },
      });
    });

    res.json({
      ok: true,
      data: {
        message: "Resume uploaded.",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const getResume: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const applicantId = req.user?.applicantId;
    const applicant = await prisma.applicant.findFirst({
      where: {
        id: applicantId,
      },
    });

    if (!applicant) {
      res.status(404).json({
        ok: false,
        errors: ["Applicant doesnt exist"],
      });
      return;
    }

    if (!applicant.resumeLink) {
      res.status(204).json({
        ok: true,
      });
      return;
    }

    const file = await prisma.uploadedFile.findFirst({
      where: {
        storedName: applicant?.resumeLink,
      },
    });

    const filePath = checkFile(UploadType.RESUME, applicant.resumeLink);

    if (!file || !filePath) {
      res.status(204).json({
        ok: true,
      });
      return;
    }

    res.setHeader("Content-Type", file.mimeType ?? "application/octet-stream");
    res.setHeader("Content-Disposition", contentDisposition(file.originalName));
    res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};
