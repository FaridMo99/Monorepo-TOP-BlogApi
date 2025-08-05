import { Router } from "express";
import { loginSchema } from "@monorepotopblogapi/schemas";
import bcrypt from "bcrypt";
import z, { treeifyError } from "zod";
import prisma from "../db/prismaClient";
import { User } from "../generated/prisma";

const loginRouter = Router();

loginRouter.post("/", async (req, res, next) => {
  try {
    const formVals: z.infer<typeof loginSchema> = req.body;
    const data = loginSchema.parse(formVals);
    const user: User | null = await prisma.user.findUnique({
      where: {
        username: data.username,
      },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Login failed, invalid credentials" });
    }
    const isValid: boolean = await bcrypt.compare(user.password, data.password);
    if (!isValid) {
      return res
        .status(400)
        .json({ message: "Login failed, invalid Credentials" });
    }
    return res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Login failed, invalid Credentials",
        errors: treeifyError(error),
      });
    }
    next(error);
  }
});

export default loginRouter;
