// packages
import { Request, RequestHandler, Response } from "express";

// libraries
import { prisma } from "../lib/prisma";

export const getUsers: RequestHandler = async (
  _req: Request,
  res: Response,
) => {
  try {
    const user = await prisma.user.create({
      data: {
        email: "test@gmail.com",
        password: "test123",
        role: "APPLICANT",
      },
    });

    res.json({
      ok: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ ok: false });
  }
};
