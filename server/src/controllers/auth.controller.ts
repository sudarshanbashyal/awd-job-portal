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
import { Role } from "generated/prisma/enums";

interface RegisterUserDto {
  email: string;
  password: string;
  role: Role;
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

    const newUser = await prisma.user.create({
      data: {
        email: registerUserDto.email,
        role: registerUserDto.role,
        password: hashedPw,
      },
    });

    res.status(201).json({
      ok: true,
      data: {
        email: newUser.email,
      },
    });
  } catch (error) {
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
    res.status(500).json({ ok: false });
  }
};
