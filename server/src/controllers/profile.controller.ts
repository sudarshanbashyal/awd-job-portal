// packages
import { RequestHandler, Response } from "express";
import contentDisposition from "content-disposition";

// libraries
import {
  prisma,
  checkFile,
  uploadImage,
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
        message: "Applicant skills updated.",
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
        message: "Applicant education updated.",
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
        message: "Applicant experience updated.",
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
      orderBy: {
        createdAt: "desc",
      },
    });

    const educations = await prisma.education.findMany({
      where: {
        applicantId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const experiences = await prisma.professionalExperience.findMany({
      where: {
        applicantId,
      },
      orderBy: {
        createdAt: "desc",
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
  try {
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

    const fileEncoding = file.buffer.toString("base64");
    const fileUrl = await uploadImage(fileEncoding, file.filename);
    if (!fileUrl?.url) {
      res.status(500).json({
        ok: false,
        errors: ["Coudln't upload profile picture"],
      });
      return;
    }

    await prisma.user.update({
      where: {
        id: userId as string,
      },
      data: {
        profilePicture: fileUrl.url,
      },
    });

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

export const deleteAccount: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.id;
    await prisma.user.update({
      where: {
        id: userId as string,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    res.json({
      ok: true,
      data: {
        message: "Account deleted.",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const getprofile: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const authUser = req.user;
    const user = await prisma.user.findFirst({
      where: {
        id: authUser?.id as string,
      },
      select: {
        id: true,
        email: true,
        profilePicture: true,
        role: true,
        recruiter: !!authUser?.recruiterId,
        applicant: authUser?.applicantId
          ? {
            include: {
              skills: {
                orderBy: {
                  createdAt: "desc",
                },
              },
              education: {
                orderBy: {
                  createdAt: "desc",
                },
              },
              professionalExperience: {
                orderBy: {
                  createdAt: "desc",
                },
              },
            },
          }
          : false,
      },
    });

    if (!user) {
      res.status(404).json({
        ok: false,
        errors: ["User not found."],
      });
    }

    res.json({
      ok: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const deleteExperience: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const id = req.params?.id;
    const applicantId = req.user?.applicantId;

    await prisma.professionalExperience.delete({
      where: {
        id,
        applicantId,
      },
    });

    res.json({
      ok: true,
      data: {
        message: "Experience deleted",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const deleteEducation: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const id = req.params?.id;
    const applicantId = req.user?.applicantId;

    await prisma.education.delete({
      where: {
        id,
        applicantId,
      },
    });

    res.json({
      ok: true,
      data: {
        message: "Education deleted",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const deleteSkill: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const id = req.params?.id;
    const applicantId = req.user?.applicantId;

    await prisma.skills.delete({
      where: {
        id,
        applicantId,
      },
    });

    res.json({
      ok: true,
      data: {
        message: "Skill deleted",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const getResumeInfo: RequestHandler = async (
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

    if (!applicant?.resumeLink) {
      res.json({
        ok: false,
        errors: ["Applicant resume not found"],
      });
      return;
    }

    const fileInfo = await prisma.uploadedFile.findFirst({
      where: {
        AND: [
          {
            storedName: applicant?.resumeLink,
          },
          {
            userId: applicant.userId,
          },
        ],
      },
    });

    res.json({
      ok: true,
      data: fileInfo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const deleteResume: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const applicantId = req.user?.applicantId;

    await prisma.applicant.update({
      where: {
        id: applicantId,
      },
      data: {
        resumeLink: null,
      },
    });

    res.json({
      ok: true,
      data: {
        message: "Resume deleted.",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};
