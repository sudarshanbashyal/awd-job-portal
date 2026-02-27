// packages
import { Router } from "express";

// controllers
import { getUsers } from "../controllers/user.controller";

const router = Router();

router.get("/users", getUsers, (req, res) => {
  console.log("res: ", res.locals);

  res.json({
    ok: true,
  });
});

export default router;
