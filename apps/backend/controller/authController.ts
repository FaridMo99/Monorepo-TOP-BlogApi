import { loginSchema, signupSchema } from "@monorepotopblogapi/schemas";
import prisma from "../db/prismaClient";
import { RefreshToken, User } from "../generated/prisma";
import jwt from "jsonwebtoken"
import z, {  treeifyError, ZodType } from "zod";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { Decoded } from "../middleware/middleware";

//generate jwt
export function generateToken(userId: string) {
  return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET_KEY!, {
    expiresIn: "15min",
  });
}

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("Hit refresh Token".bgCyan)
  try{
    const token = req.cookies.refreshToken

  if (!token) return res.status(401).json({ message: "Not Authorized" });

  const { id } = jwt.verify(token,process.env.REFRESH_TOKEN_SECRET_KEY!) as Decoded

    const tokenInfo = await prisma.refreshToken.findFirst({ where: { AND: [{ userId: id }, { token: token }] } })

  if (!tokenInfo || tokenInfo.revoked) {
    return res.status(401).json({message:"Unauthorized"})
  }
    
    const revokedToken = await prisma.refreshToken.update({
      where: {
        id:tokenInfo.id
      },
      data: {
        revoked:true
      }
    })

    if(!revokedToken) return res.status(500).json({message:"Server Error.Try again!"})

  const refreshToken = jwt.sign(
    { id },
    process.env.REFRESH_TOKEN_SECRET_KEY!,
    {
      expiresIn: "7d",
    }
  );

      const data: RefreshToken = await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      if (!data) {
        return res.status(500).json({ message: "Server Error. Try again." });
      }

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "dev",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/auth/refreshToken",
      });
  
  const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET_KEY!, {
    expiresIn:"15min"
  })

    res.status(200).json({ token: accessToken })

  } catch (error) {
    next(error)
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
) {

  console.log(
    `credentials from login: ${Object.keys(req.body).map((key) => req.body[key])}`
      .blue
  );
  try {

    const formVals: z.infer<typeof loginSchema> = req.body;
    const user: User | null = await prisma.user.findUnique({
      where: {
        username: formVals.username,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Login failed, invalid credentials" });
    }

    const isValid: boolean = await bcrypt.compare(
      formVals.password,
      user.password
    );

    if (!isValid) {
      return res
        .status(400)
        .json({ message: "Login failed, invalid Credentials" });
    }

    const { password, email, id, ...safeUser } = user;
    const sendUser = { ...safeUser, token: generateToken(user.id) };

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET_KEY!,
      {
        expiresIn:"7d"
      }
    );

    const data: RefreshToken = await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    if (!data) {
      return res
        .status(500)
        .json({ message: "Server Error. Try again." });
      }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "dev",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/auth/refreshToken",
    });

    return res.status(200).json(sendUser);

  } catch (error) {

    next(error);

  }
}

export async function signup(req: Request, res: Response, next: NextFunction) {
    console.log(
      `credentials from signup: ${Object.keys(req.body).map((key) => req.body[key])}`
        .magenta
    );
  try {

    const formVals: z.infer<typeof signupSchema> = req.body;
    const hashedPassword = await bcrypt.hash(formVals.password, 10);

    const existingUser: User | null = await prisma.user.findFirst({
      where: {
        OR: [{ email: formVals.email }, { username: formVals.username }],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email or username already in use",
      });
    }

    const user: User = await prisma.user.create({
      data: {
        username: formVals.username,
        email: formVals.email,
        password: hashedPassword,
      },
    });

    if (user) {
      const { password, email, id, ...safeUser } = user;

      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN_SECRET_KEY!,
        {
          expiresIn:"7d"
        }
      );

      const data: RefreshToken = await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      if (!data) {
        return res.status(500).json({message:"Server Error. Try again."})
      }
      
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "dev",
        sameSite: process.env.NODE_ENV === "dev" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/auth/refreshToken",
      });
      
      const sendUser = { ...safeUser, token: generateToken(user.id) };
      return res.status(201).json(sendUser);

    } else {

      res.status(400);
      throw new Error("Signup failed");

    }
  } catch (error) {

    next(error);

  }
}

export function validateInput<T>(schema: ZodType<T, any>) {

  return (req: Request, res: Response, next: NextFunction) => {

    try {
      console.log(`credentials from zod: ${Object.keys(req.body).map(key=>req.body[key])}`.yellow)
      req.body = schema.parse(req.body)
      next();

    } catch (error) {

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: treeifyError(error),
        });
      }

      next(error);

    }
  };
}