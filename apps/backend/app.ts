import express from "express";
import url from "url";
import path from "path";
import dotenv from "dotenv";
import usersRouter from "./routes/users";
import postsRouter from "./routes/posts";
import {errorMiddleware} from "./middleware/errorMiddleware"
import cors from "cors"
import "colors";
import authRouter from "./routes/auth";
import cookieParser from "cookie-parser";
dotenv.config();
const PORT = process.env.PORT;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())


app.use(
  cors({
    origin: [process.env.ORIGIN_CLIENT_USER!, process.env.ORIGIN_CLIENT_ADMIN!],
    credentials: true
  })
);



app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/users", usersRouter); 


app.use((req, res, next) => {
  const host = req.hostname;

  if (host === process.env.ORIGIN_CLIENT_USER) {
    express.static(path.join(__dirname, "../frontend-user/build"))(
      req,
      res,
      next
    );
  } else if (host === process.env.ORIGIN_CLIENT_ADMIN) {
    express.static(path.join(__dirname, "../frontend-admin/build"))(
      req,
      res,
      next
    );
  } else {
    res.status(404).send("Unknown Subdomain");
  }
});


/* uncomment on deployment
app.get("*", (req, res) => {
  const host = req.hostname;

  if (host === process.env.ORIGIN_CLIENT_USER) {
    res.sendFile(path.join(__dirname, "../frontend-user/build/index.html"));
  } else if (host === process.env.ORIGIN_CLIENT_ADMIN) {
    res.sendFile(path.join(__dirname, "../frontend-admin/build/index.html"));
  } else {
    res.status(404).send("Unknown subdomain");
  }
});
*/

//global error handler
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log("Server is Running".green);
});