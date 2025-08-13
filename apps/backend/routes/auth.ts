import { Router } from "express";
import { refreshToken, validateInput } from "../controller/authController";
import { login, signup } from "../controller/authController";
import { loginSchema, signupSchema } from "@monorepotopblogapi/schemas";

const authRouter = Router();

authRouter.post("/login",validateInput(loginSchema), login);
authRouter.post("/signup", validateInput(signupSchema),signup);
authRouter.post("/refreshToken",refreshToken);


export default authRouter;