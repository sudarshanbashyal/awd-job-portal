// packages
import { Router } from "express";

// libs
import { isAuth } from "../lib";

// controllers
import * as Controller from "../controllers";

export const authRouter = Router();

authRouter.get("/auth/login", Controller.login);
authRouter.post("/auth/register", Controller.register);
authRouter.patch("/auth/password", isAuth, Controller.changePassword);
