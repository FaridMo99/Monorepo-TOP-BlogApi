import { loginSchema, signupSchema } from "@monorepotopblogapi/schemas";
import prisma from "../db/prismaClient";
import { User } from "../generated/prisma";
import z, { treeifyError } from "zod";
import { generateToken } from "../middleware/middleware";
import bcrypt from "bcrypt";

export async function login(req, res, next) {
      try {
        const formVals: z.infer<typeof loginSchema> = req.body;
        if (!formVals.username || !formVals.password) {
          res.status(400).json({ message: "Fields are missing" });
        }
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
        const isValid: boolean = await bcrypt.compare(
          user.password,
          data.password
        );
        if (!isValid) {
          return res
            .status(400)
            .json({ message: "Login failed, invalid Credentials" });
        }
        const { password, email, id, ...safeUser } = user;
        const sendUser = { ...safeUser, token: generateToken(user.username) };
        return res.status(201).json(sendUser);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Login failed, invalid Credentials",
            errors: treeifyError(error),
          });
        }
        next(error);
      }
}

export async function signup(req, res, next) {
      try {
        const formVals: z.infer<typeof signupSchema> = req.body;
        if (!formVals.email || !formVals.username || !formVals.password) {
          res.status(400).json({ message: "Fields are missing" });
        }
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

        if (user) {
          const { password, email, id, ...safeUser } = user;
          const sendUser = { ...safeUser, token: generateToken(user.username) };
          return res.status(201).json(sendUser);
        } else {
          res.status(400);
          throw new Error("Signup failed");
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Signup failed, invalid Credentials",
            errors: treeifyError(error),
          });
        }
        next(error);
      }
}