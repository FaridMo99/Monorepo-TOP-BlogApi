import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import url from "url";
import path from "path";
import dotenv from "dotenv";
import loginRouter from "./routes/login";
import signupRouter from "./routes/signup";
import usersRouter from "./routes/users";
import postsRouter from "./routes/posts";
import cors from "cors"
import jwt from "jsonwebtoken";
import {v4} from "uuid"
import "colors";

dotenv.config();
const PORT = process.env.PORT;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: [process.env.ORIGIN_CLIENT_USER!, process.env.ORIGIN_CLIENT_ADMIN!],
    //credentials: true,
  })
);

app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/posts", postsRouter);
app.use("/users", usersRouter);


//global error handler
app.use(
  "/",
  (err: Error, req: Request, res: Response, next: NextFunction) => {},
);

app.listen(PORT, () => {
  console.log("Server is Running".green);
});
