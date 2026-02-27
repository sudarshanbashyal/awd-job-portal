// packages
import { Request, RequestHandler, Response } from "express";

// libraries
import { prisma } from "../lib/prisma";

export const getUsers: RequestHandler = async (
  _req: Request,
  res: Response,
  next,
) => {
  try {
    // const user = await prisma.user.create({
    //   data: {
    //     email: "test@gmail.com",
    //     password: "test123",
    //     role: "APPLICANT",
    //   },
    // });
    // res.json({
    //   ok: true,
    // data: user,
    // });

    res.locals = {
      data: "hello 123",
    };
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false });
  }
};
