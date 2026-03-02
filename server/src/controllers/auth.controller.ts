// packages
import { Request, RequestHandler, Response } from "express";

// libraries
import {
  prisma,
  comparePassword,
  encryptPassword,
  generateAccessToken,
} from "../lib";

// prisma
import { Role } from "../../generated/prisma/enums";

// types
interface RegisterUserDto {
  email: string;
  password: string;
  role: Role;

  firstName: string;
  lastName: string;

  companyName?: string;
  companyAddress?: string;
}

interface LoginDto {
  email: string;
  password: string;
}

export const register: RequestHandler = async (req: Request, res: Response) => {
  try {
    const registerUserDto: RegisterUserDto = req.body;
    const user = await prisma.user.findFirst({
      where: { email: registerUserDto.email.trim() },
    });

    if (user) {
      res.json({
        ok: false,
        errors: ["User with email already exists."],
      });
      return;
    }

    const hashedPw = await encryptPassword(registerUserDto.password);

    const result = await prisma.$transaction(async (_tx) => {
      const newUser = await prisma.user.create({
        data: {
          email: registerUserDto.email,
          role: registerUserDto.role,
          password: hashedPw,
        },
      });

      if (registerUserDto.role === Role.APPLICANT) {
        await prisma.applicant.create({
          data: {
            firstName: registerUserDto.firstName,
            lastName: registerUserDto.lastName,
            userId: newUser.id,
          },
        });
      } else {
        await prisma.recruiter.create({
          data: {
            firstName: registerUserDto.firstName,
            lastName: registerUserDto.lastName,
            companyName: registerUserDto.companyName!,
            companyAddress: registerUserDto.companyAddress!,
            userId: newUser.id,
          },
        });
      }

      return newUser;
    });

    res.status(201).json({
      ok: true,
      data: {
        id: result.id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const login: RequestHandler = async (req: Request, res: Response) => {
  try {
    const loginDto: LoginDto = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email: loginDto.email,
      },
      include: {
        applicant: true,
        recruiter: true,
      },
    });

    if (!user || !comparePassword(loginDto.password, user.password)) {
      res.status(404).json({
        ok: false,
        errors: ["Incorrect email or password."],
      });
      return;
    }

    res.json({
      ok: true,
      data: {
        accessToken: generateAccessToken(user),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};
