import { Router } from "express";
import { deleteUserById, getAllUsers, getUserById, updateUserById } from "../controller/usersController";
import { authMiddleware } from "../middleware/middleware";

const usersRouter = Router();

//get all users
usersRouter.get("/",authMiddleware,getAllUsers);

//get single user
usersRouter.get("/:userId",authMiddleware,getUserById);

//delete single user
usersRouter.delete("/:userId",authMiddleware,deleteUserById);

//update single user
usersRouter.patch("/:userId",authMiddleware,updateUserById);

export default usersRouter;
