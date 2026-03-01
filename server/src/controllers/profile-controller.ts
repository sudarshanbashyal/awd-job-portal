// packages
import { RequestHandler, Response } from "express";

// libraries
import { AuthRequest, generateResumeFromProfile, prisma } from "../lib";

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

    generateResumeFromProfile(applicant, user, skills, educations, experiences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};
