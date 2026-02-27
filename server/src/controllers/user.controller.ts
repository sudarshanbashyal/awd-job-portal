// packages
import { Request, RequestHandler, Response } from "express";

// libraries
import { AuthRequest, prisma } from "../lib";

export const getProfile: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const payload = req.user;
    if (!payload) throw new Error();

    const user = await prisma.user.findFirst({
      where: {
        email: payload.email as string,
      },
      select: {
        id: true,
        email: true,
      }
      ,
    });

    if (!user) {
      res.status(404).json({
        ok: false,
        errors: ["User not found."],
      });
      return;
    }

    res.json({
      ok: true,
      data: {
        user
      }
    })
  } catch (error) {
    res.status(500).json({ ok: false });
  }
};
