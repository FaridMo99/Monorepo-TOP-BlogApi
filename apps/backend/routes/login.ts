import { Router } from "express";
import { login } from "../controller/authController";


const loginRouter = Router();

loginRouter.post("/",login);

export default loginRouter;
