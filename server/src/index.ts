// packages
import cors from "cors";
import dotenv from "dotenv";
import Express, { json } from "express";

// routes
import {
  authRouter,
  profileRouter,
  jobPostingRouter,
  jobApplicationRouter,
} from "./routes";

const init = async () => {
  dotenv.config();
  const app = Express();

  app.use(Express.urlencoded({ extended: true }));

  app.use(
    json({
      limit: "50mb",
    }),
    cors(),
  );

  app.use([authRouter, profileRouter, jobPostingRouter, jobApplicationRouter]);

  app.listen(process.env.PORT || 3000, () => {
    console.log(`Up and up on ${process.env.PORT}!!`);
  });
};

init();
