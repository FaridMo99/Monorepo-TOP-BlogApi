import { Router } from "express";
import { deleteUserById, getAllUsers, getUserById, updateUserById } from "../controller/usersController";
import { adminAuthorizationMiddleware, authenticateToken, sameUserAuthorization } from "../middleware/middleware";

const usersRouter = Router();

//get all users
usersRouter.get("/", authenticateToken,adminAuthorizationMiddleware, getAllUsers);

//get single user
usersRouter.get("/:userId", authenticateToken,sameUserAuthorization, getUserById);

//delete single user
usersRouter.delete("/:userId", authenticateToken,sameUserAuthorization, deleteUserById);

//update single user
usersRouter.patch("/:userId", authenticateToken,sameUserAuthorization, updateUserById);

export default usersRouter;