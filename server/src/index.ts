// packages
import cors from "cors";
import dotenv from "dotenv";
import Express, { json } from "express";

// routes
import UserRouter from "./routes/user.route";

const init = async () => {
    dotenv.config();
    const app = Express();

    app.use(
        json({
            limit: "50mb",
        }),
        cors(),
    );

    app.use([UserRouter]);

    app.listen(process.env.PORT || 3000, () => {
        console.log(`Up and up on ${process.env.PORT}!!`);
    });
};

init();
