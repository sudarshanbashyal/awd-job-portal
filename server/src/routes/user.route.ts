// packages
import { Router } from "express";

// controllers
import { getUsers } from "../controllers/user.controller";

const router = Router();

router.get("/users", getUsers);

export default router;
