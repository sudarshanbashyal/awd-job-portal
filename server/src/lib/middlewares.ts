// packages
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// prisma
import { Role } from "generated/prisma/enums";

export interface TokenPayload {
  email: String;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const isAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.AUTH_KEY!) as TokenPayload;
    if (!decoded) throw new Error();

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
