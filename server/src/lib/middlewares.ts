// packages
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// prisma
import { Role } from "../../generated/prisma/enums";

export interface TokenPayload {
  id: String;
  email: String;
  role: Role;
  recruiterId?: string;
  applicantId?: string;
}

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

const extractPayloadFromToken = (req: AuthRequest) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return null;

    const token = authHeader?.split(" ")[1];
    return jwt.verify(token, process.env.AUTH_KEY!) as TokenPayload;
  } catch (error) {
    return null;
  }
};

export const isAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tokenPayload = extractPayloadFromToken(req);
    if (!tokenPayload) {
      res.status(401).json({
        ok: false,
        errors: ["Invalid or expired token"],
      });
      return;
    }

    req.user = tokenPayload;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const isApplicant = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tokenPayload = extractPayloadFromToken(req);
    if (!tokenPayload) {
      res.status(401).json({
        ok: false,
        errors: ["Invalid or expired token"],
      });
      return;
    }

    if (tokenPayload.role !== Role.APPLICANT) {
      res.status(401).json({
        ok: false,
        errors: ["Only applicants can access this resource."],
      });
      return;
    }

    req.user = tokenPayload;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const isRecruiter = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tokenPayload = extractPayloadFromToken(req);
    if (!tokenPayload) {
      res.status(401).json({
        ok: false,
        errors: ["Invalid or expired token"],
      });
      return;
    }

    if (tokenPayload.role !== Role.RECRUITER) {
      res.status(401).json({
        ok: false,
        errors: ["Only recruiters can access this resource."],
      });
      return;
    }

    req.user = tokenPayload;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
