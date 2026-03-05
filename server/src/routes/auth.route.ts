// packages
import { Router } from "express";

// libs
import { isAuth } from "../lib";

// controllers
import * as Controller from "../controllers";

export const authRouter = Router();

authRouter.post("/auth/login", Controller.login);
authRouter.post("/auth/register", Controller.register);
authRouter.get("/auth/token", isAuth, Controller.checkToken);
authRouter.patch("/auth/password", isAuth, Controller.changePassword);
authRouter.patch("/auth/reset-password", isAuth, Controller.resetPassword);
authRouter.post("/auth/reset-token", isAuth, Controller.generateResetToken);
