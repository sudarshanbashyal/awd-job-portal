// packages
import { Request, RequestHandler, Response } from "express";

// libraries
import {
  prisma,
  AuthRequest,
  generateToken,
  comparePassword,
  encryptPassword,
  generateAccessToken,
  sendResetTokenEmail,
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

interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

interface ResetTokenDto {
  token: string;
}

interface ResetPasswordDto {
  token: string;
  email: string;
  password: string;
}

interface GenerateResetTokenRequest {
  email: string;
}

export const register: RequestHandler = async (req: Request, res: Response) => {
  try {
    const registerUserDto: RegisterUserDto = req.body;
    const user = await prisma.user.findFirst({
      where: { email: registerUserDto.email.trim() },
    });

    if (user) {
      res.status(401).json({
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

    if (!user || !(await comparePassword(loginDto.password, user.password))) {
      res.status(404).json({
        ok: false,
        errors: ["Incorrect email or password."],
      });
      return;
    }

    if (user.deletedAt) {
      res.status(401).json({
        ok: false,
        errors: ["Account has been deleted."],
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

export const changePassword: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req?.user?.id;
    const changePasswordDto: ChangePasswordDto = req.body;

    const user = await prisma.user.findFirst({
      where: {
        id: userId as string,
      },
    });

    if (!user) {
      res.status(404).json({
        ok: false,
        errors: ["User not found"],
      });
      return;
    }

    if (
      !(await comparePassword(changePasswordDto.oldPassword, user.password))
    ) {
      res.status(404).json({
        ok: false,
        errors: ["Incorrect password"],
      });
      return;
    }

    const hashedPw = await encryptPassword(changePasswordDto.newPassword);
    await prisma.user.update({
      where: {
        id: userId as string,
      },
      data: {
        password: hashedPw,
      },
    });

    res.json({
      ok: true,
      data: {
        message: "Password updated",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const generateResetToken: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const resetTokenDto: GenerateResetTokenRequest = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email: resetTokenDto.email,
      },
      include: {
        applicant: true,
        recruiter: true,
      },
    });

    if (!user) {
      res.status(404).json({
        ok: false,
        errors: ["User not found."],
      });
      return;
    }

    const resetToken = await prisma.resetTokens.create({
      data: {
        token: generateToken(),
        userId: user.id,
        expiresAt: new Date(new Date().getTime() + 60 * 60 * 1000),
      },
    });

    const firstName = user?.applicant?.firstName || user?.recruiter?.firstName;
    sendResetTokenEmail(user?.email, {
      firstName: firstName as string,
      token: resetToken.token.toString(),
    });

    res.json({
      ok: true,
      data: {
        messsage: "Token sent",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const checkToken: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req?.user?.id;
    const resetTokenDto: ResetTokenDto = req.body;

    const latestToken = await prisma.resetTokens.findFirst({
      where: {
        AND: [
          {
            userId: userId as string,
          },
          {
            expiresAt: {
              gt: new Date(),
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (resetTokenDto.token !== latestToken?.token?.toString()) {
      res.status(401).json({
        ok: false,
        errors: ["Token mismatch."],
      });
    }

    res.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};

export const resetPassword: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const resetPasswordDto: ResetPasswordDto = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email: resetPasswordDto.email,
      },
      include: {
        applicant: true,
        recruiter: true,
      },
    });

    if (!user) {
      res.status(404).json({
        ok: false,
        errors: ["User not found."],
      });
      return;
    }

    const latestToken = await prisma.resetTokens.findFirst({
      where: {
        AND: [
          {
            userId: user.id as string,
          },
          {
            expiresAt: {
              gt: new Date(),
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (resetPasswordDto.token !== latestToken?.token?.toString()) {
      res.status(401).json({
        ok: false,
        errors: ["Token mismatch."],
      });
    }

    const hashedPw = await encryptPassword(resetPasswordDto.password);
    await prisma.user.update({
      where: {
        id: user.id as string,
      },
      data: {
        password: hashedPw,
      },
    });

    res.json({
      ok: true,
      data: {
        message: "Password updated",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};
