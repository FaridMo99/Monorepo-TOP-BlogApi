import prisma from "../db/prismaClient";
import { userUpdateSchema } from "@monorepotopblogapi/schemas";
import { User } from "../generated/prisma";
import { NextFunction, Request, Response } from "express";
import z from "zod";
import bcrypt from "bcrypt"

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users: User[] | [] = await prisma.user.findMany();
    const safeUsers = users.map(user=> ({id:user.id,username:user.username,email:user.email,isAdmin:user.isAdmin}))
    return res.status(200).json(safeUsers);
  } catch (error) {
    next(error);
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    const user: User | null = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "No valid User found" });
    }
    const {password, ...safeUser} = user
    return res.status(200).json(safeUser);
  } catch (error) {
    next(error);
  }
}

export async function deleteUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    const user: User | null = await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "User not Found" });
    }

    const { password, ...safeUser } = user;
    return res.status(200).json(safeUser);
  } catch (error) {
    next(error);
  }
}

export async function updateUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    const fieldsToUpdate:z.infer<typeof userUpdateSchema> = req.body;
    const saveFields = userUpdateSchema.parse(fieldsToUpdate);

   
    if (saveFields.password) {
      saveFields.password = await bcrypt.hash(saveFields.password,10)
    }


    const user: User | null = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...(saveFields.username && { username: saveFields.username }),
        ...(saveFields.email && { email: saveFields.email }),
        ...(saveFields.password && { password: saveFields.password })
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User not Found" });
    }
    const { password, ...safeUser } = user;
    return res.status(200).json(safeUser);
  } catch (error) {
    next(error);
  }
}