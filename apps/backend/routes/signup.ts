import { Router } from "express";
import { signup } from "../controller/authController";
const signupRouter = Router();

signupRouter.post("/",signup);

export default signupRouter;
