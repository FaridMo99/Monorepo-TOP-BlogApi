import { Router } from "express";
import { deleteUserById, getAllUsers, getUserById, updateUserById } from "../controller/usersController";
import { authenticateToken } from "../middleware/middleware";

const usersRouter = Router();

//get all users
usersRouter.get("/", authenticateToken, getAllUsers);

//get single user
usersRouter.get("/:userId", authenticateToken, getUserById);

//delete single user
usersRouter.delete("/:userId", authenticateToken, deleteUserById);

//update single user
usersRouter.patch("/:userId", authenticateToken, updateUserById);

export default usersRouter;
