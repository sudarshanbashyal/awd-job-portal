// packages
import { Router } from "express";

// controllers
import * as Controller from "../controllers";

// libs
import { isAuth } from "../lib";

export const userRouter = Router();

userRouter.get("/profile", isAuth, Controller.getProfile);
