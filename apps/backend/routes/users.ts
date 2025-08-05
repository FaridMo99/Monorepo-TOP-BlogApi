import { Router } from "express";
import prisma from "../db/prismaClient";
import { userUpdateSchema } from "@monorepotopblogapi/schemas";
import { User } from "../generated/prisma";

const usersRouter = Router();

//get all users
usersRouter.get("/", async (req, res, next) => {
  try {
    const users: User[] | [] = await prisma.user.findMany();
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

//get single user
usersRouter.get("/:userId", async (req, res, next) => {
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
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

//delete single user
usersRouter.delete("/:userId", async (req, res, next) => {
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
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

//update single user
usersRouter.patch("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const fieldsToUpdate = req.body;
    const saveFields = userUpdateSchema.parse(fieldsToUpdate);
    //transform the keys of fields and put into data when known
    const user: User | null = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {},
    });

    if (!user) {
      return res.status(400).json({ message: "User not Found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
