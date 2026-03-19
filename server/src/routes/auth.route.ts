// packages
import { Router } from "express";

// controllers
import * as Controller from "../controllers";

export const authRouter = Router();

authRouter.post("/auth/login", Controller.login);
authRouter.post("/auth/register", Controller.register);
authRouter.post("/auth/verify-token", Controller.checkToken);
authRouter.patch("/auth/password", Controller.changePassword);
authRouter.patch("/auth/reset-password", Controller.resetPassword);
authRouter.post("/auth/reset-token", Controller.generateResetToken);
