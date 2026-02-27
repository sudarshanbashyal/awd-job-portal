// packages
import { Router } from "express";

// controllers
import * as Controller from "../controllers";

export const authRouter = Router();

authRouter.post("/auth/register", Controller.register);
authRouter.get("/auth/login", Controller.login);
