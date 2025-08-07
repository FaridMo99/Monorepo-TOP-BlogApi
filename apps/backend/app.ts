import express from "express";
import url from "url";
import path from "path";
import dotenv from "dotenv";
import loginRouter from "./routes/login";
import signupRouter from "./routes/signup";
import usersRouter from "./routes/users";
import postsRouter from "./routes/posts";
import {errorMiddleware} from "./middleware/errorMiddleware"
import cors from "cors"
import "colors";
dotenv.config();
const PORT = process.env.PORT;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//form req and json middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//cors for cross domain api calls
//cors not needed here since the whole
//app gets hosted together

app.use(
  cors({
    origin: [process.env.ORIGIN_CLIENT_USER!, process.env.ORIGIN_CLIENT_ADMIN!],
    //credentials: true,
  })
);


app.use((req, res, next) => {
  console.log(req.method, req.params, req.query)
})

app.use("/login", loginRouter);
app.use("/signup", signupRouter);
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
    res.status(404).send("Unknown subdomain");
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
app.use("/",errorMiddleware);

app.listen(PORT, () => {
  console.log("Server is Running".green);
});
