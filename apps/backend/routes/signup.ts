import { Router } from "express";
import { signupSchema } from "@monorepotopblogapi/schemas";
import bcrypt from "bcrypt";
import z, { treeifyError } from "zod";
import prisma from "../db/prismaClient";
import { User } from "../generated/prisma";

const signupRouter = Router();

signupRouter.post("/", async (req, res, next) => {
  const formVals: z.infer<typeof signupSchema> = req.body;
  try {
    const data = signupSchema.parse(formVals);
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const existingUser: User | null = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email or username already in use",
      });
    }

    const user: User = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
      },
    });
    return res.status(201).json({ message: "User created Successfully!" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Signup failed, invalid Credentials",
        errors: treeifyError(error),
      });
    }
    next(error);
  }
});

export default signupRouter;
